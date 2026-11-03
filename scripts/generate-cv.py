"""Create editable CVs from the same registry that powers the website.

PDFs are rendered from these DOCX files by LibreOffice in the deployment job.
"""
import json
from pathlib import Path
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

def link(paragraph, title, url):
    rel = paragraph.part.relate_to(url, 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink', is_external=True)
    h = OxmlElement('w:hyperlink'); h.set(qn('r:id'), rel)
    r = OxmlElement('w:r'); props = OxmlElement('w:rPr')
    color = OxmlElement('w:color'); color.set(qn('w:val'), '176C59'); props.append(color)
    r.append(props); t = OxmlElement('w:t'); t.text = title; r.append(t); h.append(r); paragraph._p.append(h)

for profile in json.loads(Path('.cv-build/profiles.json').read_text(encoding='utf-8')):
    for lang, t in profile['content'].items():
        doc = Document(); sec = doc.sections[0]
        sec.page_width = Inches(8.5); sec.page_height = Inches(11)
        sec.top_margin = sec.bottom_margin = Inches(.65)
        sec.left_margin = sec.right_margin = Inches(.72)
        for name in ['Normal', 'Title', 'Subtitle', 'Heading 1', 'Heading 2', 'List Bullet']:
            style = doc.styles[name]; style.font.name = 'DejaVu Sans'
            style.font.color.rgb = RGBColor(0, 0, 0)
            for border in list(style.element.iter(qn('w:pBdr'))):
                border.getparent().remove(border)
        normal = doc.styles['Normal']; normal.font.size = Pt(11)
        normal.paragraph_format.space_after = Pt(6)
        normal.paragraph_format.line_spacing = 1.08
        doc.styles['Title'].font.size = Pt(27)
        doc.styles['Heading 1'].font.size = Pt(17)
        doc.styles['Heading 2'].font.size = Pt(13)
        footer = sec.footer.paragraphs[0]; footer.alignment = 2
        footer.add_run(t['name'] + '  |  ')
        field = OxmlElement('w:fldSimple'); field.set(qn('w:instr'), 'PAGE'); footer._p.append(field)
        for run in footer.runs: run.font.size = Pt(8)
        doc.core_properties.title = t['name'] + ' - ' + profile['label'][lang]
        doc.core_properties.author = t['name']
        doc.add_paragraph(t['name'], 'Title')
        doc.add_paragraph(t['role'], 'Subtitle')
        doc.add_paragraph(t['location'])
        p = doc.add_paragraph(); link(p, 'Telegram', profile['telegram']); p.add_run('  |  ')
        link(p, profile['email'], 'mailto:' + profile['email'])
        p = doc.add_paragraph(); link(p, 'Portfolio', 'https://bigmouth-fringe.github.io/cv-portfolio/?cv=' + profile['id'])
        doc.add_heading('Profile' if lang == 'en' else 'О себе', 1)
        for paragraph in t['aboutParagraphs']: doc.add_paragraph(paragraph)
        doc.add_heading(t['skills'], 1)
        for group in profile['toolkit']:
            p = doc.add_paragraph(); p.add_run(group['label'][lang] + ': ').bold = True
            p.add_run(', '.join(group['skills']))
        doc.add_heading(t['education'], 1)
        doc.add_paragraph(t['degree']); doc.add_paragraph(t['languages'])
        for i, job in enumerate(t['jobs']):
            if i in (0, 1): doc.add_page_break()
            if i == 0: doc.add_heading(t['experience'], 1)
            doc.add_heading(job['company'], 2)
            p = doc.add_paragraph(); p.add_run(job['role']).bold = True
            p.add_run('\n' + job['date'])
            for paragraph in job['text'].split('\n\n'): doc.add_paragraph(paragraph)
            for bullet in job['bullets']: doc.add_paragraph(bullet, 'List Bullet')
            p = doc.add_paragraph(job['stack']); p.paragraph_format.space_after = Pt(14)
            for r in p.runs: r.font.size = Pt(9)
        out = Path('public/cv') / profile['id']; out.mkdir(parents=True, exist_ok=True)
        doc.save(out / f'{lang}.docx')
        print(out / f'{lang}.docx')
