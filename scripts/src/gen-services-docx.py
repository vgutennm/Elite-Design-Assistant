from docx import Document
from docx.shared import Pt, RGBColor, Inches
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml.ns import qn
from docx.oxml import OxmlElement

RED = RGBColor(0xDC, 0x26, 0x26)
DARK = RGBColor(0x18, 0x18, 0x1B)
GREY = RGBColor(0x52, 0x52, 0x5B)

doc = Document()

# Tighten margins for one page
for s in doc.sections:
    s.top_margin = Inches(0.5)
    s.bottom_margin = Inches(0.5)
    s.left_margin = Inches(0.6)
    s.right_margin = Inches(0.6)

base = doc.styles["Normal"]
base.font.name = "Calibri"
base.font.size = Pt(9)


def set_cell_bg(cell, hex_color):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:val"), "clear")
    shd.set(qn("w:color"), "auto")
    shd.set(qn("w:fill"), hex_color)
    tcPr.append(shd)


def no_space(p, before=0, after=2):
    p.paragraph_format.space_before = Pt(before)
    p.paragraph_format.space_after = Pt(after)


# Title
t = doc.add_paragraph()
no_space(t, 0, 1)
r = t.add_run("FURY COMBAT SYSTEMS")
r.font.size = Pt(20)
r.font.bold = True
r.font.color.rgb = DARK
t.alignment = WD_ALIGN_PARAGRAPH.CENTER

sub = doc.add_paragraph()
no_space(sub, 0, 1)
r = sub.add_run("SERVICES")
r.font.size = Pt(11)
r.font.bold = True
r.font.color.rgb = RED
sub.alignment = WD_ALIGN_PARAGRAPH.CENTER

tag = doc.add_paragraph()
no_space(tag, 0, 6)
r = tag.add_run("Private, founder-led training with Soke David Fury (Grandmaster Dr. David Furie)  |  Brooklyn, NY  |  By inquiry only")
r.font.size = Pt(8.5)
r.font.italic = True
r.font.color.rgb = GREY
tag.alignment = WD_ALIGN_PARAGRAPH.CENTER


def section_heading(text, desc):
    h = doc.add_paragraph()
    no_space(h, 4, 1)
    r = h.add_run(text)
    r.font.size = Pt(12)
    r.font.bold = True
    r.font.color.rgb = RED
    d = doc.add_paragraph()
    no_space(d, 0, 3)
    r = d.add_run(desc)
    r.font.size = Pt(8.5)
    r.font.italic = True
    r.font.color.rgb = GREY


def build_table(rows, headers, widths):
    table = doc.add_table(rows=1, cols=len(headers))
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.style = "Table Grid"
    hdr = table.rows[0].cells
    for i, htext in enumerate(headers):
        p = hdr[i].paragraphs[0]
        no_space(p, 1, 1)
        run = p.add_run(htext)
        run.font.bold = True
        run.font.size = Pt(9)
        run.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
        set_cell_bg(hdr[i], "18181B")
    for row in rows:
        cells = table.add_row().cells
        for i, val in enumerate(row):
            p = cells[i].paragraphs[0]
            no_space(p, 1, 1)
            run = p.add_run(val)
            run.font.size = Pt(8.5)
            if i == 0:
                run.font.bold = True
                run.font.color.rgb = DARK
    for i, w in enumerate(widths):
        for cell in table.columns[i].cells:
            cell.width = Inches(w)
    return table


# Elite
section_heading(
    "Elite Private Training",
    "Discreet personal protection, situational readiness, and real combat skill, one-on-one.",
)
elite = [
    ["Private Instruction", "$250 / session", "Fully customized one-on-one training built around your goals, level, and focus areas."],
    ["Advanced Tactical Instruction", "$500 / session", "Elevated, strategic training in readiness, decision-making, and response under pressure."],
    ["Women's Private Safety Training", "$300 / session", "Practical awareness, confidence, prevention, de-escalation, and decisive response for women."],
    ["Tactical Conditioning", "$150 / session", "Purposeful conditioning blended with movement, reaction, and defensive drills."],
    ["Young Adult Readiness Training", "$225 / session", "Awareness and confidence for college, commuting, travel, and independence (ages ~16+)."],
    ["Executive Readiness", "$400 / session", "Premium, discreet training in composure, awareness, and self-command for professionals."],
    ["Family Protection Session", "$350 / session", "Shared awareness, protective habits, and emergency thinking for individuals and families."],
    ["Private Workshops", "From $1,500", "Tailored group sessions for companies, leadership teams, women's groups, and organizations."],
]
build_table(elite, ["Service", "Price", "What it is"], [2.0, 1.0, 4.3])

# Sport
section_heading(
    "Martial Arts & Combat Sports",
    "Private competitive instruction in Brooklyn for adults and young athletes (custom pricing; each includes a demo video).",
)
sport = [
    ["Self Defense", "Awareness, prevention, hand-to-hand defense, and decisive real-world response."],
    ["Jujitsu", "Leverage, control, and close-combat skill, technique over brute strength."],
    ["Ninjutsu", "Adaptability, awareness, movement, weapons concepts, and combat strategy."],
    ["Kickboxing", "Striking, footwork, conditioning, and defensive readiness."],
    ["Mixed Martial Arts", "Striking, grappling, clinch, and ground integrated into full-spectrum combat."],
    ["Weapons and Tactics", "Responsible weapons familiarity, tactical movement, and disciplined response."],
]
build_table(sport, ["Service", "What it is"], [2.0, 5.3])

# Contact
c = doc.add_paragraph()
no_space(c, 8, 0)
r = c.add_run("Contact:  ")
r.font.bold = True
r.font.size = Pt(9)
r.font.color.rgb = RED
r2 = c.add_run("(917) 340-2911   |   david.furie@gmail.com   |   24 Cobek Ct, Brooklyn, NY 11223")
r2.font.size = Pt(9)
r2.font.color.rgb = DARK
c.alignment = WD_ALIGN_PARAGRAPH.CENTER

out = "Fury-Combat-Systems-Services.docx"
doc.save(out)
print("saved", out)
