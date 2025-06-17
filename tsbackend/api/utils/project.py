import json

def parse_tags_field(tags_raw):
    if isinstance(tags_raw, list):
        return tags_raw

    if hasattr(tags_raw, 'getlist'):
        return tags_raw.getlist('tags')

    if isinstance(tags_raw, str):
        try:
            parsed = json.loads(tags_raw)
            if isinstance(parsed, list):
                return parsed
            if isinstance(parsed, str):
                return [tag.strip() for tag in parsed.split(',') if tag.strip()]
        except json.JSONDecodeError:
            return [tag.strip() for tag in tags_raw.split(',') if tag.strip()]

    if isinstance(tags_raw, dict):
        return list(tags_raw.values())

    return []
