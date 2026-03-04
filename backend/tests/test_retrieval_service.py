"""Tests for retrieval service - verifies parity with JS retrieval modules."""
from app.services.retrieval_service import RetrievalService
from app.models.schemas import ActSection


def _make_section(act="IPC", section="302", title="Punishment for murder", text="Whoever commits murder shall be punished"):
    return ActSection(act=act, section=section, title=title, text=text)


def _make_test_data():
    return [
        _make_section("IPC", "302", "Punishment for murder", "Whoever commits murder shall be punished with death or imprisonment for life"),
        _make_section("IPC", "304", "Punishment for culpable homicide", "Whoever commits culpable homicide not amounting to murder"),
        _make_section("CRPC", "437", "When bail may be taken in case of non-bailable offence", "When any person accused of a non-bailable offence is arrested or detained without warrant by an officer in charge of a police station"),
        _make_section("CRPC", "438", "Direction for grant of bail to person apprehending arrest", "Where any person has reason to believe that he may be arrested on accusation of having committed a non-bailable offence"),
        _make_section("CPC", "9", "Courts to try all civil suits unless barred", "The Courts shall have jurisdiction to try all suits of a civil nature"),
        _make_section("IEA", "3", "Interpretation clause", "Evidence includes all statements which the Court permits or requires to be made before it by witnesses"),
    ]


# --- analyzeQuery() ---

def test_analyze_query_normalizes():
    svc = RetrievalService([])
    result = svc.analyze_query("Section 437 CrPC?")
    assert result["normalized"] == "section 437 crpc"
    assert "section" in result["tokens"]
    assert "437" in result["tokens"]


# --- detectActs() ---

def test_detect_acts_by_keyword():
    svc = RetrievalService([])
    assert "CRPC" in svc.detect_acts(["bail", "crpc"])
    assert "IPC" in svc.detect_acts(["murder", "ipc"])


def test_detect_acts_default_fallback():
    svc = RetrievalService([])
    result = svc.detect_acts(["hello", "world"])
    assert "IPC" in result
    assert "CRPC" in result


def test_detect_acts_multiple():
    svc = RetrievalService([])
    result = svc.detect_acts(["murder", "bail"])
    assert "IPC" in result
    assert "CRPC" in result


# --- extractSectionNumbers() ---

def test_extract_section_numbers():
    svc = RetrievalService([])
    assert svc.extract_section_numbers("section 437") == ["437"]
    assert svc.extract_section_numbers("Section 302 and Section 304") == ["302", "304"]


def test_extract_section_numbers_none():
    svc = RetrievalService([])
    assert svc.extract_section_numbers("what is bail") == []


def test_extract_section_numbers_with_alpha():
    svc = RetrievalService([])
    result = svc.extract_section_numbers("section 304a")
    assert "304a" in result


# --- rankSections() ---

def test_rank_sections_scoring():
    data = _make_test_data()
    svc = RetrievalService(data)
    ranked = svc.rank_sections(data, ["murder"])
    # Section 302 has "murder" in both title (+3) and text (+2) = 5
    assert len(ranked) > 0
    assert ranked[0]["section"] == "302"
    assert ranked[0]["score"] == 5


def test_rank_sections_filters_zero_score():
    data = _make_test_data()
    svc = RetrievalService(data)
    ranked = svc.rank_sections(data, ["zzznonsense"])
    assert len(ranked) == 0


# --- retrieveRelevantSections() ---

def test_retrieve_relevant_sections_by_act():
    data = _make_test_data()
    svc = RetrievalService(data)
    results = svc.retrieve_relevant_sections("bail under crpc")
    assert len(results) > 0
    assert all(r["act"] == "CRPC" for r in results)


def test_retrieve_relevant_sections_with_section_number():
    data = _make_test_data()
    svc = RetrievalService(data)
    results = svc.retrieve_relevant_sections("section 437 crpc bail")
    assert len(results) > 0
    # Section 437 should be in results
    sections = [r["section"] for r in results]
    assert "437" in sections


def test_retrieve_relevant_sections_limit():
    data = _make_test_data()
    svc = RetrievalService(data)
    results = svc.retrieve_relevant_sections("murder crime ipc", limit=2)
    assert len(results) <= 2
