import re


def normalize(text: str) -> str:
    """Port of qaMatcher.js normalize().
    Lowercase, strip non-alphanumeric (keep spaces), collapse whitespace.
    """
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s]", "", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def jaccard_similarity(a: str, b: str) -> float:
    """Port of qaMatcher.js similarity().
    Returns intersection / max(|A|, |B|) on word-level sets.
    NOTE: The existing JS uses max(A.size, B.size), NOT standard Jaccard (union).
    We preserve this exactly for behavioral parity.
    """
    set_a = set(a.split())
    set_b = set(b.split())
    if not set_a and not set_b:
        return 0.0
    intersection = set_a & set_b
    return len(intersection) / max(len(set_a), len(set_b))
