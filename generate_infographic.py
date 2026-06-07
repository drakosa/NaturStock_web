from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm, cm
from reportlab.lib.colors import HexColor, white, black
from reportlab.pdfgen import canvas
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import Paragraph, Table, TableStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import os

# ── Colors ──────────────────────────────────────────────────────────────
DARK_GREEN   = HexColor("#1B5E20")
MID_GREEN    = HexColor("#2E7D32")
LIGHT_GREEN  = HexColor("#4CAF50")
SOFT_GREEN   = HexColor("#A5D6A7")
PALE_GREEN   = HexColor("#E8F5E9")
WHITE        = white
LIGHT_GRAY   = HexColor("#F5F5F5")
MID_GRAY     = HexColor("#9E9E9E")
DARK_GRAY    = HexColor("#424242")
ACCENT_GREEN = HexColor("#66BB6A")
WARNING_RED  = HexColor("#E53935")
CHECK_GREEN  = HexColor("#43A047")
CARD_SHADOW  = HexColor("#E0E0E0")

# ── Page setup ──────────────────────────────────────────────────────────
W, H = A4
MARGIN = 25 * mm
CONTENT_WIDTH = W - 2 * MARGIN

# ── Helper shapes ───────────────────────────────────────────────────────

def rounded_rect(c, x, y, w, h, r=6):
    c.roundRect(x, y, w, h, r, fill=1, stroke=0)

def draw_icon_circle(c, x, y, size, color, icon_char=None):
    """Draw a circle with optional centered text."""
    c.setFillColor(color)
    c.circle(x, y, size / 2, fill=1, stroke=0)
    if icon_char:
        c.setFillColor(WHITE)
        c.setFont("Helvetica-Bold", size * 0.7)
        c.drawCentredString(x, y - size * 0.28, icon_char)

def draw_warning_icon(c, x, y, size):
    c.setFillColor(WARNING_RED)
    c.circle(x, y, size / 2, fill=1, stroke=0)
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", size * 0.7)
    c.drawCentredString(x, y - size * 0.28, "!")

def draw_check_icon(c, x, y, size):
    c.setFillColor(CHECK_GREEN)
    c.circle(x, y, size / 2, fill=1, stroke=0)
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", size * 0.6)
    c.drawCentredString(x, y - size * 0.25, "\u2713")

def draw_ai_icon(c, x, y, size):
    c.setFillColor(DARK_GREEN)
    c.circle(x, y, size / 2, fill=1, stroke=0)
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", size * 0.5)
    c.drawCentredString(x, y - size * 0.28, "AI")

def draw_db_icon(c, x, y, size):
    c.setFillColor(MID_GREEN)
    c.circle(x, y, size / 2, fill=1, stroke=0)
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", size * 0.45)
    c.drawCentredString(x, y - size * 0.25, "DB")

def draw_valid_icon(c, x, y, size):
    c.setFillColor(LIGHT_GREEN)
    c.circle(x, y, size / 2, fill=1, stroke=0)
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", size * 0.45)
    c.drawCentredString(x, y - size * 0.25, "V")


class Infographic:
    def __init__(self, filename):
        self.c = canvas.Canvas(filename, pagesize=A4)
        self.c.setTitle("Auditoria Codigo IA - NaturaStock Cusco")
        self.y = H - MARGIN
        self.page_count = 1

        # ── Header ──────────────────────────────────────────────────────────
        self.draw_header()
        self.y -= 15 * mm

        # ── Section 1: Uso de IA ────────────────────────────────────────────
        self.draw_section_title("\u00a7 1  USO DE IA EN EL PROYECTO")
        self.draw_usage_card()
        self.y -= 10 * mm

        # ── Section 2: Problemas Detectados ─────────────────────────────────
        self.draw_section_title("\u00a7 2  PROBLEMAS DETECTADOS")
        self.draw_problems()
        self.y -= 8 * mm

        # ── Section 3: Correcciones Realizadas ──────────────────────────────
        self.draw_section_title("\u00a7 3  CORRECCIONES REALIZADAS")
        self.draw_corrections()
        self.y -= 8 * mm

        # ── Section 4: Resultados Obtenidos ─────────────────────────────────
        self.draw_section_title("\u00a7 4  RESULTADOS OBTENIDOS")
        self.draw_results()
        self.y -= 8 * mm

        # ── Section 5: Conclusion ──────────────────────────────────────────
        self.draw_section_title("\u00a7 5  CONCLUSI\u00d3N")
        self.draw_conclusion()
        self.y -= 10 * mm

        # ── Footer ──────────────────────────────────────────────────────────
        self.draw_footer()

        self.c.save()

    # ── Drawing helpers ──────────────────────────────────────────────────

    def _text_width(self, text, font, size):
        """Approximate text width."""
        return pdfmetrics.stringWidth(text, font, size)

    def _auto_newpage(self, needed_height):
        if self.y - needed_height < MARGIN + 40 * mm:
            self.c.showPage()
            self.page_count += 1
            self.y = H - MARGIN

    def draw_header(self):
        # Top bar
        c = self.c
        c.setFillColor(DARK_GREEN)
        c.rect(0, H - 55 * mm, W, 55 * mm, fill=1, stroke=0)

        # Subtle decorative line
        c.setStrokeColor(LIGHT_GREEN)
        c.setLineWidth(3)
        c.line(MARGIN, H - 52 * mm, W - MARGIN, H - 52 * mm)

        # Title
        c.setFillColor(WHITE)
        c.setFont("Helvetica-Bold", 22)
        c.drawCentredString(W / 2, H - 18 * mm, "AUDITOR\u00cdA DEL C\u00d3DIGO GENERADO POR IA")
        c.setFont("Helvetica-Bold", 16)
        c.drawCentredString(W / 2, H - 32 * mm, "NATURASTOCK CUSCO")

        # Subtitle
        c.setFillColor(SOFT_GREEN)
        c.setFont("Helvetica-Oblique", 12)
        c.drawCentredString(W / 2, H - 44 * mm, "Sprint 2 \u2013 Desarrollo del N\u00facleo del Sistema")

        # Reset y position
        self.y = H - 60 * mm

    def draw_section_title(self, text):
        c = self.c
        self._auto_newpage(20 * mm)
        self.y -= 4 * mm
        # Left accent bar
        c.setFillColor(LIGHT_GREEN)
        c.rect(MARGIN, self.y - 2 * mm, 5 * mm, 10 * mm, fill=1, stroke=0)
        # Title text
        c.setFillColor(DARK_GREEN)
        c.setFont("Helvetica-Bold", 13)
        c.drawString(MARGIN + 9 * mm, self.y, text)
        self.y -= 14 * mm

    def draw_card(self, x, y, w, h, color=WHITE, border_color=None):
        c = self.c
        if border_color:
            c.setFillColor(border_color)
            c.roundRect(x - 1, y - 1, w + 2, h + 2, 6, fill=1, stroke=0)
        c.setFillColor(color)
        c.roundRect(x, y, w, h, 6, fill=1, stroke=0)

    # ── USO DE IA ─────────────────────────────────────────────────────────

    def draw_usage_card(self):
        c = self.c
        self._auto_newpage(45 * mm)

        card_x = MARGIN
        card_w = CONTENT_WIDTH
        card_h = 38 * mm
        self.draw_card(card_x, self.y - card_h, card_w, card_h, WHITE, CARD_SHADOW)

        # AI icon
        draw_ai_icon(c, MARGIN + 10 * mm, self.y - 10 * mm, 18)

        # Decorative vertical line
        c.setStrokeColor(SOFT_GREEN)
        c.setLineWidth(1)
        c.line(MARGIN + 26 * mm, self.y - 5 * mm, MARGIN + 26 * mm, self.y - card_h + 5 * mm)

        # Text
        text_x = MARGIN + 34 * mm
        c.setFillColor(DARK_GRAY)
        c.setFont("Helvetica", 10)
        text = ("La inteligencia artificial fue utilizada para apoyar la generaci\u00f3n de c\u00f3digo, "
                "dise\u00f1o de interfaces, conexi\u00f3n con Supabase, consultas SQL y funcionalidades "
                "del sistema NaturaStock Cusco.")
        self._draw_wrapped_text(c, text_x, self.y - 7 * mm, card_w - 42 * mm, 16, "Helvetica", 10, DARK_GRAY, text)

        # Tags
        tags = ["Copilot", "ChatGPT", "Claude", "Supabase"]
        tag_x = text_x
        for tag in tags:
            tag_w = self._text_width(tag, "Helvetica-Bold", 7) + 10
            c.setFillColor(PALE_GREEN)
            c.roundRect(tag_x, self.y - 28 * mm, tag_w, 6 * mm, 4, fill=1, stroke=0)
            c.setFillColor(MID_GREEN)
            c.setFont("Helvetica-Bold", 7)
            c.drawCentredString(tag_x + tag_w / 2, self.y - 27.5 * mm, tag)
            tag_x += tag_w + 4 * mm

        self.y -= card_h + 4 * mm

    # ── PROBLEMAS DETECTADOS ─────────────────────────────────────────────

    def draw_problems(self):
        c = self.c
        problems = [
            {
                "title": "1. Variables inconsistentes",
                "icon": "!",
                "items": [
                    "Diferencias entre nombres de variables",
                    "Errores entre frontend y base de datos",
                    "Incompatibilidad entre producto_id e id_producto"
                ]
            },
            {
                "title": "2. Errores de conexi\u00f3n",
                "icon": "!",
                "items": [
                    "Problemas al consumir datos desde Supabase",
                    "Respuestas incorrectas de consultas",
                    "Registros que no se almacenaban correctamente"
                ]
            },
            {
                "title": "3. Moneda incorrecta",
                "icon": "!",
                "items": [
                    "Valores generados inicialmente en d\u00f3lares",
                    "Incompatibilidad con el contexto peruano"
                ]
            },
            {
                "title": "4. Validaciones incompletas",
                "icon": "!",
                "items": [
                    "Campos vac\u00edos permitidos",
                    "Precios negativos",
                    "Stock menor a cero"
                ]
            }
        ]

        cards_per_row = 2
        card_w = (CONTENT_WIDTH - 8 * mm) / cards_per_row
        card_h = 40 * mm

        self._auto_newpage(85 * mm)

        for i, prob in enumerate(problems):
            col = i % cards_per_row
            row = i // cards_per_row

            card_x = MARGIN + col * (card_w + 8 * mm)
            card_y = self.y - (row + 1) * card_h - row * 4 * mm

            # Need new page?
            if card_y < MARGIN:
                self.c.showPage()
                self.page_count += 1
                self.y = H - MARGIN
                # Redraw section title on new page would be nice, but skip for simplicity
                row = 0
                card_y = self.y - card_h

            self.draw_card(card_x, card_y, card_w, card_h, WHITE, CARD_SHADOW)

            # Warning icon
            draw_warning_icon(c, card_x + 8 * mm, card_y + card_h - 10 * mm, 14)

            # Title
            c.setFillColor(DARK_GREEN)
            c.setFont("Helvetica-Bold", 9)
            c.drawString(card_x + 26 * mm, card_y + card_h - 14 * mm, prob["title"])

            # Separator line
            c.setStrokeColor(SOFT_GREEN)
            c.setLineWidth(0.5)
            c.line(card_x + 6 * mm, card_y + card_h - 20 * mm,
                   card_x + card_w - 6 * mm, card_y + card_h - 20 * mm)

            # Items
            c.setFillColor(DARK_GRAY)
            c.setFont("Helvetica", 8)
            item_y = card_y + card_h - 24 * mm
            for item in prob["items"]:
                c.drawString(card_x + 8 * mm, item_y, "\u2022  " + item)
                item_y -= 4.5 * mm

        total_rows = (len(problems) + cards_per_row - 1) // cards_per_row
        self.y -= total_rows * card_h + (total_rows - 1) * 4 * mm + 6 * mm

    def _draw_wrapped_text(self, c, x, y, max_width, line_height, font, size, color, text):
        """Simple word-wrap text drawing."""
        c.setFillColor(color)
        c.setFont(font, size)
        words = text.split()
        line = ""
        for word in words:
            test = line + (" " if line else "") + word
            if self._text_width(test, font, size) <= max_width:
                line = test
            else:
                c.drawString(x, y, line)
                y -= line_height
                line = word
        if line:
            c.drawString(x, y, line)

    # ── CORRECCIONES REALIZADAS ──────────────────────────────────────────

    def draw_corrections(self):
        c = self.c
        corrections = [
            "Adaptaci\u00f3n completa a moneda peruana (S/)",
            "Correcci\u00f3n de nombres de variables y campos",
            "Validaci\u00f3n de formularios y controles de entrada",
            "Optimizaci\u00f3n de consultas SQL",
            "Correcci\u00f3n de llamadas API hacia Supabase",
            "Mejora de estabilidad del sistema"
        ]

        self._auto_newpage(75 * mm)

        card_x = MARGIN
        card_w = CONTENT_WIDTH
        card_h = 68 * mm
        self.draw_card(card_x, self.y - card_h, card_w, card_h, WHITE, CARD_SHADOW)

        items_per_col = 3
        col_w = (card_w - 20 * mm) / 2

        for i, corr in enumerate(corrections):
            col = i // items_per_col
            row = i % items_per_col

            item_x = card_x + 8 * mm + col * (col_w + 8 * mm)
            item_y = self.y - 12 * mm - row * 10 * mm

            # Check icon
            draw_check_icon(c, item_x + 4 * mm, item_y, 10)

            # Text
            c.setFillColor(DARK_GRAY)
            c.setFont("Helvetica", 9)
            c.drawString(item_x + 18 * mm, item_y - 2 * mm, corr)

        self.y -= card_h + 4 * mm

    # ── RESULTADOS OBTENIDOS ─────────────────────────────────────────────

    def draw_results(self):
        c = self.c
        results = [
            ("Mayor estabilidad del sistema", "99%"),
            ("Mejor integraci\u00f3n Frontend + Supabase", "95%"),
            ("Reducci\u00f3n de errores", "85%"),
            ("Datos consistentes", "98%"),
            ("Mejor experiencia de usuario", "92%"),
        ]

        self._auto_newpage(55 * mm)

        card_x = MARGIN
        card_w = CONTENT_WIDTH
        card_h = 48 * mm
        self.draw_card(card_x, self.y - card_h, card_w, card_h, WHITE, CARD_SHADOW)

        # Progress bars
        bar_y = self.y - 12 * mm
        for i, (label, pct) in enumerate(results):
            col = i % 3
            row = i // 3

            if col < 3 and row == 0:
                x_base = card_x + 8 * mm + col * ((card_w - 20 * mm) / 3)
                # Label
                c.setFillColor(DARK_GRAY)
                c.setFont("Helvetica", 8)
                self._draw_wrapped_text(c, x_base, bar_y, (card_w - 20 * mm) / 3 - 4 * mm, 9, "Helvetica", 8, DARK_GRAY, label)
                # Percent text
                c.setFillColor(DARK_GREEN)
                c.setFont("Helvetica-Bold", 11)
                c.drawRightString(x_base + (card_w - 20 * mm) / 3 - 4 * mm, bar_y - 14 * mm, pct)
                # Bar background
                bar_w = (card_w - 20 * mm) / 3 - 4 * mm
                c.setFillColor(PALE_GREEN)
                c.roundRect(x_base, bar_y - 10 * mm, bar_w, 4 * mm, 3, fill=1, stroke=0)
                # Bar fill
                pct_val = int(pct.replace("%", ""))
                fill_w = bar_w * pct_val / 100
                c.setFillColor(LIGHT_GREEN)
                c.roundRect(x_base, bar_y - 10 * mm, fill_w, 4 * mm, 3, fill=1, stroke=0)
            elif col < 2 and row == 1:
                x_base = card_x + 8 * mm + col * ((card_w - 20 * mm) / 2) + 4 * mm
                bar_y2 = bar_y - 24 * mm
                c.setFillColor(DARK_GRAY)
                c.setFont("Helvetica", 8)
                c.drawString(x_base, bar_y2, label)
                c.setFillColor(DARK_GREEN)
                c.setFont("Helvetica-Bold", 11)
                c.drawString(x_base + 100 * mm, bar_y2, pct)
                c.setFillColor(PALE_GREEN)
                c.roundRect(x_base, bar_y2 - 6 * mm, 90 * mm, 4 * mm, 3, fill=1, stroke=0)
                pct_val = int(pct.replace("%", ""))
                fill_w = 90 * mm * pct_val / 100
                c.setFillColor(LIGHT_GREEN)
                c.roundRect(x_base, bar_y2 - 6 * mm, fill_w, 4 * mm, 3, fill=1, stroke=0)

        self.y -= card_h + 4 * mm

    # ── CONCLUSION ────────────────────────────────────────────────────────

    def draw_conclusion(self):
        c = self.c
        self._auto_newpage(45 * mm)

        card_x = MARGIN
        card_w = CONTENT_WIDTH
        card_h = 38 * mm
        self.draw_card(card_x, self.y - card_h, card_w, card_h, WHITE, CARD_SHADOW)

        # AI icon
        draw_ai_icon(c, MARGIN + 10 * mm, self.y - 10 * mm, 18)

        # Vertical line
        c.setStrokeColor(SOFT_GREEN)
        c.setLineWidth(1)
        c.line(MARGIN + 26 * mm, self.y - 5 * mm, MARGIN + 26 * mm, self.y - card_h + 5 * mm)

        # Text
        text_x = MARGIN + 34 * mm
        conclusion_text = ("La inteligencia artificial aceler\u00f3 significativamente el desarrollo del "
                          "proyecto; sin embargo, fue necesaria la revisi\u00f3n humana para corregir "
                          "errores, adaptar el sistema al contexto peruano y garantizar la calidad "
                          "final del software.")
        self._draw_wrapped_text(c, text_x, self.y - 7 * mm, card_w - 42 * mm, 15, "Helvetica", 10, DARK_GRAY, conclusion_text)

        self.y -= card_h + 4 * mm

    # ── FOOTER ────────────────────────────────────────────────────────────

    def draw_footer(self):
        c = self.c
        self._auto_newpage(35 * mm)

        # Background bar
        c.setFillColor(DARK_GREEN)
        c.rect(0, 0, W, 35 * mm, fill=1, stroke=0)

        # Decorative top line
        c.setStrokeColor(LIGHT_GREEN)
        c.setLineWidth(2)
        c.line(MARGIN, 35 * mm - 3 * mm, W - MARGIN, 35 * mm - 3 * mm)

        # Footer info
        info_lines = [
            "Curso: Dise\u00f1o de Software  |  Proyecto: NaturaStock Cusco",
            "Universidad Continental  |  Grupo: Error 404 Team"
        ]
        c.setFillColor(WHITE)
        c.setFont("Helvetica", 9)
        c.drawCentredString(W / 2, 16 * mm, info_lines[0])
        c.setFont("Helvetica-Bold", 9)
        c.drawCentredString(W / 2, 7 * mm, info_lines[1])

        # Page number
        c.setFillColor(SOFT_GREEN)
        c.setFont("Helvetica", 7)
        c.drawRightString(W - MARGIN, 28 * mm, f"P\u00e1g. {self.page_count}")


if __name__ == "__main__":
    output_path = os.path.expanduser("~/Desktop/Naturmed/Infografia_Auditoria_IA_NaturaStock.pdf")
    pdf = Infographic(output_path)
    print(f"PDF generated: {output_path}")
