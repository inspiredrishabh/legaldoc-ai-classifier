import json
from pathlib import Path
from app.config import Settings
from app.models.schemas import ActSection, QAPair


def _parse_hma_record(record: dict) -> ActSection | None:
    """Handle HMA's malformed CSV-in-JSON format.
    Key is 'chapter,section,section_title,section_desc', value is CSV string.
    Format: "chapter_num,section_num,title,description"
    """
    key = "chapter,section,section_title,section_desc"
    value = record.get(key, "")
    if not value or not value.strip():
        return None
    # Split with maxsplit=3 since description may contain commas
    parts = value.split(",", 3)
    if len(parts) < 3:
        return None
    section = parts[1].strip() if len(parts) > 1 else None
    title = parts[2].strip().strip('"') if len(parts) > 2 else ""
    text = parts[3].strip().strip('"') if len(parts) > 3 else ""
    return ActSection(act="HMA", section=section, title=title, text=text)


def load_all_acts(settings: Settings) -> list[ActSection]:
    """Port of actLoader.js loadAllActs().
    Reads all JSON files from acts directory, normalizes multiple schema variants.
    """
    acts: list[ActSection] = []
    acts_dir = settings.ACTS_DIR

    for file_path in sorted(acts_dir.glob("*.json")):
        act_name = file_path.stem.upper()
        raw = json.loads(file_path.read_text(encoding="utf-8"))

        for record in raw:
            # Format D: HMA malformed CSV-in-JSON
            if "chapter,section,section_title,section_desc" in record:
                parsed = _parse_hma_record(record)
                if parsed:
                    acts.append(parsed)
                continue

            # Formats A/B/C: normalize field names
            # section: Section (IPC) or section (others)
            section = record.get("section") or record.get("Section")
            # title: title (CPC/IDA/MVA) or section_title (IPC/CRPC/IEA/NIA)
            title = record.get("title") or record.get("section_title", "")
            # text: description (CPC/IDA/MVA) or section_desc (IPC/CRPC/IEA/NIA)
            text = record.get("description") or record.get("section_desc", "")

            acts.append(ActSection(
                act=act_name,
                section=str(section) if section is not None else None,
                title=title,
                text=text,
            ))

    return acts


def load_all_qa(settings: Settings) -> list[QAPair]:
    """Port of qaLoader.js loadAllQA().
    Reads all JSON files from qa directory.
    """
    qa_pairs: list[QAPair] = []
    qa_dir = settings.QA_DIR

    for file_path in sorted(qa_dir.glob("*.json")):
        source = file_path.stem.upper()
        raw = json.loads(file_path.read_text(encoding="utf-8"))

        for item in raw:
            qa_pairs.append(QAPair(
                source=source,
                question=item["question"],
                answer=item["answer"],
            ))

    return qa_pairs
