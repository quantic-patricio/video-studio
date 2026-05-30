#!/usr/bin/env python3
"""Analyze a public YouTube video with the Gemini multimodal API.

Gemini acts as a *sensor*: it watches the video and answers a structured brief
composed by Claude. It does NOT author creative content — the prompt should ask
for analysis (style, structure, delivery, key moments), never "write a script".

Reads the API key from the GEMINI_API_KEY environment variable.
Prints a single JSON object to stdout:
    {"ok": true, "model": "...", "url": "...", "analysis": <str|object>}
On error, prints {"ok": false, "error": "..."} to stdout and exits non-zero.

Usage:
    analyze_video.py --url <youtube_url> --prompt-file <path> [options]

Options:
    --url URL            Public YouTube URL (required).
    --prompt TEXT        Analysis brief as a string.
    --prompt-file PATH   Analysis brief read from a file (preferred for long briefs).
    --model NAME         Gemini model (default: gemini-2.5-flash).
    --start OFFSET       Clip start, e.g. "90s" (optional; trims cost on long videos).
    --end OFFSET         Clip end, e.g. "300s" (optional).
    --schema-file PATH   JSON Schema file; when given, forces structured JSON output.
"""

import argparse
import json
import os
import sys


def fail(message: str) -> "NoReturn":  # type: ignore[name-defined]
    print(json.dumps({"ok": False, "error": message}))
    sys.exit(1)


def main() -> None:
    parser = argparse.ArgumentParser(description="Analyze a YouTube video with Gemini.")
    parser.add_argument("--url", required=True)
    parser.add_argument("--prompt")
    parser.add_argument("--prompt-file")
    parser.add_argument("--model", default="gemini-2.5-flash")
    parser.add_argument("--start")
    parser.add_argument("--end")
    parser.add_argument("--schema-file")
    args = parser.parse_args()

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        fail("GEMINI_API_KEY is not set in the environment.")

    # Resolve the analysis brief.
    if args.prompt_file:
        try:
            with open(args.prompt_file, "r", encoding="utf-8") as fh:
                prompt = fh.read().strip()
        except OSError as exc:
            fail(f"Could not read --prompt-file: {exc}")
    elif args.prompt:
        prompt = args.prompt
    else:
        fail("Provide --prompt or --prompt-file.")

    if not prompt:
        fail("The analysis brief is empty.")

    # Optional structured-output schema.
    schema = None
    if args.schema_file:
        try:
            with open(args.schema_file, "r", encoding="utf-8") as fh:
                schema = json.load(fh)
        except (OSError, json.JSONDecodeError) as exc:
            fail(f"Could not read/parse --schema-file: {exc}")

    try:
        from google import genai
        from google.genai import types
    except ImportError:
        fail("google-genai is not installed. Run the skill's setup.sh first.")

    client = genai.Client(api_key=api_key)

    # Build the video part, optionally clipped to a segment to control cost.
    video_metadata = None
    if args.start or args.end:
        video_metadata = types.VideoMetadata(
            start_offset=args.start,
            end_offset=args.end,
        )
    video_part = types.Part(
        file_data=types.FileData(file_uri=args.url),
        video_metadata=video_metadata,
    )
    contents = types.Content(parts=[video_part, types.Part(text=prompt)])

    config = None
    if schema is not None:
        config = types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=schema,
        )

    try:
        response = client.models.generate_content(
            model=args.model,
            contents=contents,
            config=config,
        )
    except Exception as exc:  # noqa: BLE001 — surface the raw API error verbatim
        fail(f"Gemini API call failed: {exc}")

    text = (response.text or "").strip()
    if not text:
        fail("Gemini returned an empty response (video may be private, "
             "unavailable, or blocked).")

    # If a schema was requested, hand back parsed JSON; otherwise raw text.
    analysis = text
    if schema is not None:
        try:
            analysis = json.loads(text)
        except json.JSONDecodeError:
            # Keep the raw text so the caller can still recover something.
            analysis = {"_raw": text}

    print(json.dumps({
        "ok": True,
        "model": args.model,
        "url": args.url,
        "analysis": analysis,
    }, ensure_ascii=False))


if __name__ == "__main__":
    main()
