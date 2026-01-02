from mapping import *

DEV_TO_TIR = {}
DEV_TO_TIR.update(DEV_TO_TIR_VOWELS)
DEV_TO_TIR.update(DEV_TO_TIR_CONSONANTS)
DEV_TO_TIR.update(DEV_TO_TIR_MATRAS)
DEV_TO_TIR.update(DEV_TO_TIR_HALANT)
DEV_TO_TIR.update(DEV_TO_TIR_SIGNS)
DEV_TO_TIR.update(DEV_TO_TIR_DIGITS)

DEV_TO_TIR[" "] = " "
DEV_TO_TIR["।"] = "।"
DEV_TO_TIR["॥"] = "॥"

def devnagari_to_tirhuta(text: str) -> str:
    """
    Simple character-by-character mapping from Devanagari to Tirhuta.
    Note: This does NOT reorder combining marks (e.g. the placement rule for 'ि'),
    nor does it perform full orthographic shaping; it replaces characters one-by-one.
    For many purposes this is sufficient; for perfect rendering you may need
    a shaping/font that supports Tirhuta or a more advanced algorithm.
    """
    return "".join(DEV_TO_TIR.get(ch, ch) for ch in text)

if __name__ == "__main__":
    samples = [
        "हमरा घर अछि",
        "मिथिला",
        "मैथिली भाषा",
        "कर्म",
        "ज्ञान",
        "संस्कृति १२३"
    ]
    for s in samples:
        print(s, "->", devnagari_to_tirhuta(s))
