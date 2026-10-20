/**
 * pdfReportGenerator.js — Generates a comprehensive, publication-grade PDF report
 * of Islamic inheritance distribution (Farā'iḍ) using jsPDF and jspdf-autotable.
 * Includes all heir shares, classifications, legal conditions, mathematical bases,
 * and classical scholarly citations.
 */

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { t } from '../../i18n/i18n.js';
import { heirEvidences } from '../../data/evidences.js';

function getHeirKeyFromName(name) {
    if (!name) return '';
    const map = {
        'Husband': 'husband', 'Wife': 'wife', 'Wives': 'wife', 'Father': 'father', 'Mother': 'mother',
        'Paternal Grandfather': 'grandfather', 'Maternal Grandmother': 'maternalGrandmother', 'Paternal Grandmother': 'paternalGrandmother',
        'Son': 'son', 'Sons': 'son', 'Daughter': 'daughter', 'Daughters': 'daughter',
        'Full Brother': 'brother', 'Full Sister': 'sister', 'Paternal Brother': 'paternalBrother', 'Paternal Sister': 'paternalSister',
        'Maternal Brother': 'maternalBrother', 'Maternal Sister': 'maternalSister',
        'Grandson': 'grandson', 'Grandsons': 'grandson', 'Granddaughter': 'granddaughter', 'Granddaughters': 'granddaughter',
        'Sons of Full Brother': 'sonOfFullBrother', 'Sons of Paternal Half-Brother': 'sonOfPaternalBrother',
        'Full Paternal Uncles': 'uncle', 'Consanguine Paternal Uncles': 'consanguinePaternalUncle',
        'Sons of Full Paternal Uncle': 'paternalUncleSon', 'Sons of Consanguine Paternal Uncle': 'consanguinePaternalUncleSon'
    };
    return map[name] || name.toLowerCase().replace(/[^a-z]/g, '');
}

/**
 * Formats a currency number safely for PDF printing.
 */
function formatCurrency(amount, currency = '$') {
    if (typeof amount === 'number') {
        return `${currency}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    if (typeof amount === 'string' && amount !== '-' && !isNaN(parseFloat(amount))) {
        return `${currency}${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return amount || '-';
}

/**
 * Returns clean school name and juristic title.
 */
function getMadhhabTitle(madhhab) {
    const map = {
        shafii: "Shāfiʿī School (al-Madhhab ash-Shāfiʿī)",
        hanafi: "Ḥanafī School (al-Madhhab al-Ḥanafī)",
        maliki: "Mālikī School (al-Madhhab al-Mālikī)",
        hanbali: "Ḥanbalī School (al-Madhhab al-Ḥanbalī)",
        jumhur: "Jumhūr (Consensus of Majority Jurists)"
    };
    return map[madhhab?.toLowerCase()] || "Islamic Farā'iḍ Jurisprudence";
}

/**
 * Shows an in-app non-blocking toast notification.
 */
function showToast(message) {
    const existing = document.getElementById('pdfToastNotification');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'pdfToastNotification';
    toast.style.position = 'fixed';
    toast.style.bottom = '2rem';
    toast.style.right = '2rem';
    toast.style.zIndex = '999999';
    toast.style.background = 'linear-gradient(135deg, #064e3b, #047857)';
    toast.style.color = '#ffffff';
    toast.style.padding = '0.9rem 1.4rem';
    toast.style.borderRadius = '10px';
    toast.style.boxShadow = '0 10px 25px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.2)';
    toast.style.fontFamily = 'system-ui, -apple-system, sans-serif';
    toast.style.fontSize = '0.92rem';
    toast.style.fontWeight = '600';
    toast.style.display = 'flex';
    toast.style.alignItems = 'center';
    toast.style.gap = '0.6rem';
    toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    toast.innerHTML = `<span>📄</span> <span>${message}</span>`;

    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 350);
    }, 4500);
}

/**
 * Generates and downloads the comprehensive Farā'iḍ PDF report.
 * @param {Object} calcData — Data object from getLastCalculationData()
 */
export function generatePdfReport(calcData) {
    if (!calcData || !calcData.shares || calcData.shares.length === 0) {
        showToast("Please run an inheritance calculation first before generating a PDF.");
        return;
    }

    const {
        shares,
        messages = [],
        steps = [],
        blocked = {},
        estateValue = 0,
        detailedBreakdown = null,
        currencySymbol = '$',
        selectedMadhhab = 'shafii',
        result = {}
    } = calcData;

    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 36;
    const contentWidth = pageWidth - (margin * 2);

    const dateStr = new Date().toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
    const caseId = `FID-${Date.now().toString(36).toUpperCase()}`;

    // ─────────────────────────────────────────────────────────────
    // 1. TOP HEADER BANNER (Deep Emerald & Gold)
    // ─────────────────────────────────────────────────────────────
    doc.setFillColor(6, 78, 59); // Emerald #064e3b
    doc.rect(0, 0, pageWidth, 78, 'F');

    // Gold accent line
    doc.setFillColor(217, 119, 6); // Gold #d97706
    doc.rect(0, 78, pageWidth, 4, 'F');

    // Header Title
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text("ISLAMIC INHERITANCE (FARĀ'IḌ) DISTRIBUTION REPORT", margin, 32);

    // Subtitle
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(220, 252, 231);
    doc.text("Official Juristic & Mathematical Share Allocation • Bismillāhir-Raḥmānir-Raḥīm", margin, 48);

    // Madhhab and Case ID badge on right
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(253, 230, 138); // Soft Gold
    doc.text(getMadhhabTitle(selectedMadhhab), pageWidth - margin, 32, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(209, 250, 229);
    doc.text(`Case Ref: ${caseId}  |  ${dateStr}`, pageWidth - margin, 48, { align: 'right' });

    let currentY = 100;

    // ─────────────────────────────────────────────────────────────
    // 2. CASE SUMMARY & ESTATE FINANCIALS CARD
    // ─────────────────────────────────────────────────────────────
    doc.setFillColor(248, 250, 252); // Slate-50
    doc.setDrawColor(203, 213, 225); // Slate-300
    doc.roundedRect(margin, currentY, contentWidth, detailedBreakdown ? 75 : 55, 5, 5, 'FD');

    // Section title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(15, 23, 42);
    doc.text("CASE METADATA & FINANCIAL FOUNDATION", margin + 12, currentY + 16);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);

    // Left column: School & Case Classification
    const specialRuling = messages.find(m => m.includes("'Awl") || m.includes("Radd") || m.includes("Gharāwiyyatayn") || m.includes("Mushtarakah")) || "Standard Quranic Distribution";
    doc.text(`• Legal School: ${getMadhhabTitle(selectedMadhhab)}`, margin + 12, currentY + 31);
    doc.text(`• Allocation Rule: ${specialRuling.length > 50 ? specialRuling.slice(0, 48) + '...' : specialRuling}`, margin + 12, currentY + 44);

    // Right column: Net Estate & Base Divisor
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(6, 78, 59);
    doc.setFontSize(10.5);
    const netFormatted = formatCurrency(estateValue, currencySymbol);
    doc.text(`Net Distributable Estate: ${netFormatted}`, pageWidth - margin - 12, currentY + 22, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    const baseDivisor = result.baseDivisor || result.asl || '-';
    doc.text(`Base Divisor (Aṣl al-Mas'alah): ${baseDivisor}`, pageWidth - margin - 12, currentY + 36, { align: 'right' });

    if (detailedBreakdown) {
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        const debtText = `Gross: ${formatCurrency(detailedBreakdown.totalAssets, currencySymbol)} | Funeral: ${formatCurrency(detailedBreakdown.funeral, currencySymbol)} | Debts: ${formatCurrency(detailedBreakdown.debts, currencySymbol)} | Wasiyyah: ${formatCurrency(detailedBreakdown.allowedWill, currencySymbol)}${detailedBreakdown.isWillCapped ? ' (Capped 1/3)' : ''}`;
        doc.text(debtText, margin + 12, currentY + 62);
    }

    currentY += (detailedBreakdown ? 75 : 55) + 16;

    // ─────────────────────────────────────────────────────────────
    // 3. TABLE OF ALL HEIR SHARES & CONDITIONS (AutoTable)
    // ─────────────────────────────────────────────────────────────
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text("TABLE OF HEIR SHARES, PROPORTIONS & CONDITIONS", margin, currentY);
    currentY += 8;

    const tableRows = shares.map((s, index) => {
        const isBlocked = s.status.includes('Blocked');
        const key = s.key || getHeirKeyFromName(s.name);
        const countStr = s.count > 1 ? ` (x${s.count})` : '';
        const heirName = `${s.name}${countStr}`;

        let fractionStr = '-';
        if (!isBlocked && s.fracText && s.fracText !== '-') {
            fractionStr = s.fracText.split(' ')[0];
        }

        let totalPctStr = '0.00%';
        if (!isBlocked && s.pctPerPerson > 0) {
            totalPctStr = (s.pctPerPerson * (s.count || 1)).toFixed(2) + '%';
        }

        const totalAmountStr = isBlocked ? '-' : formatCurrency(s.totalAmount, currencySymbol);
        const eachAmountStr = (!isBlocked && s.count > 1 && s.amountPerPerson !== '-') ? formatCurrency(s.amountPerPerson, currencySymbol) : '-';

        // Legal condition / reason
        const evidenceInfo = heirEvidences[key] || {};
        const conditionText = s.reason || (isBlocked ? 'Blocked by closer heir (Ḥajb)' : evidenceInfo.evidence || 'Standard Farāʾiḍ assignment');

        return [
            String(index + 1),
            heirName,
            s.status.replace(/ʿ|ʾ/g, ''),
            fractionStr,
            totalPctStr,
            totalAmountStr,
            eachAmountStr,
            conditionText
        ];
    });

    autoTable(doc, {
        startY: currentY,
        margin: { left: margin, right: margin },
        head: [['#', 'Heir', 'Class / Status', 'Share', 'Percent', 'Total Share', 'Per Individual', 'Legal Condition & Reason']],
        body: tableRows,
        theme: 'grid',
        styles: {
            fontSize: 7.5,
            cellPadding: 4,
            textColor: [30, 41, 59],
            lineColor: [226, 232, 240],
            lineWidth: 0.5,
            valign: 'middle'
        },
        headStyles: {
            fillColor: [15, 118, 110], // Teal #0f766e
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            halign: 'center',
            fontSize: 8
        },
        columnStyles: {
            0: { cellWidth: 20, halign: 'center' },
            1: { cellWidth: 85, fontStyle: 'bold' },
            2: { cellWidth: 70, halign: 'center' },
            3: { cellWidth: 38, halign: 'center', font: 'courier', fontStyle: 'bold' },
            4: { cellWidth: 44, halign: 'center' },
            5: { cellWidth: 62, halign: 'right' },
            6: { cellWidth: 60, halign: 'right' },
            7: { cellWidth: 'auto' }
        },
        alternateRowStyles: {
            fillColor: [248, 250, 252]
        },
        didParseCell: function(data) {
            // Highlight blocked rows
            if (data.section === 'body') {
                const row = shares[data.row.index];
                if (row && row.status && row.status.includes('Blocked')) {
                    data.cell.styles.fillColor = [254, 242, 242]; // Light red
                    data.cell.styles.textColor = [185, 28, 28];
                }
            }
        }
    });

    currentY = doc.lastAutoTable.finalY + 18;

    // ─────────────────────────────────────────────────────────────
    // 4. STEP-BY-STEP REASONING & CLASSICAL JURISPRUDENCE
    // ─────────────────────────────────────────────────────────────
    // Check if we need a new page for reasoning
    if (currentY > pageHeight - 160) {
        doc.addPage();
        currentY = margin;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(15, 23, 42);
    doc.text("STEP-BY-STEP CALCULATION REASONING & EVIDENCE", margin, currentY);
    currentY += 10;

    const stepItems = [];
    if (steps && steps.length > 0) {
        steps.forEach(st => {
            const itemsJoined = (st.items || []).join('; ');
            stepItems.push([st.title, itemsJoined]);
        });
    } else {
        stepItems.push(["Distribution Execution", "All Quranic Sharers and Residuaries allocated according to consensus Farāʾiḍ rules."]);
    }

    autoTable(doc, {
        startY: currentY,
        margin: { left: margin, right: margin },
        head: [['Phase / Step', 'Procedural Verification & Legal Rationale']],
        body: stepItems,
        theme: 'plain',
        styles: {
            fontSize: 7.5,
            cellPadding: 4,
            textColor: [51, 65, 85]
        },
        headStyles: {
            fillColor: [241, 245, 249],
            textColor: [15, 23, 42],
            fontStyle: 'bold'
        },
        columnStyles: {
            0: { cellWidth: 140, fontStyle: 'bold', textColor: [6, 78, 59] },
            1: { cellWidth: 'auto' }
        }
    });

    currentY = doc.lastAutoTable.finalY + 16;

    // ─────────────────────────────────────────────────────────────
    // 5. BLOCKED HEIRS (ḤAJB) & SPECIAL CONDITIONS
    // ─────────────────────────────────────────────────────────────
    const blockedEntries = Object.entries(blocked || {}).filter(([_, b]) => b && (b.blocked || b.reason));
    if (blockedEntries.length > 0) {
        if (currentY > pageHeight - 130) {
            doc.addPage();
            currentY = margin;
        }

        doc.setFillColor(254, 243, 199); // Amber-100
        doc.setDrawColor(245, 158, 11); // Amber-500
        doc.roundedRect(margin, currentY, contentWidth, 38, 4, 4, 'FD');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(146, 64, 14); // Amber-900
        doc.text("EXCLUDED HEIRS & JURISTIC HAJB (IMPAIRMENT/EXCLUSION):", margin + 10, currentY + 14);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        const hajbNotes = blockedEntries.map(([h, b]) => `${h}: ${b.reason || 'Blocked by a closer surviving relative'}`).join(' • ');
        const wrappedHajb = doc.splitTextToSize(hajbNotes, contentWidth - 20);
        doc.text(wrappedHajb, margin + 10, currentY + 26);

        currentY += 46;
    }

    // ─────────────────────────────────────────────────────────────
    // 6. SCRIPTURAL CITATIONS & LEGAL ATTESTATION BLOCK
    // ─────────────────────────────────────────────────────────────
    if (currentY > pageHeight - 160) {
        doc.addPage();
        currentY = margin;
    }

    // Citations box
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, currentY, contentWidth, 48, 4, 4, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text("CANONICAL ISLAMIC LEGAL CITATIONS:", margin + 10, currentY + 14);

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    doc.text("• Qur'an Surah An-Nisā' (4:11, 4:12, 4:176) — Fixed shares (Ashāb al-Furūd) and parental/child allocations.", margin + 10, currentY + 26);
    doc.text("• Sahih al-Bukhārī (6732) — 'Give the appointed shares of inheritance to those entitled; whatever remains goes to the nearest male relative.'", margin + 10, currentY + 38);

    currentY += 56;

    // Formal Signature & Seal Block
    if (currentY > pageHeight - 95) {
        doc.addPage();
        currentY = margin;
    }

    const sigBoxWidth = (contentWidth - 20) / 2;

    // Executor Box
    doc.setDrawColor(203, 213, 225);
    doc.rect(margin, currentY, sigBoxWidth, 54);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);
    doc.text("Estate Executor / Representative Signature", margin + 8, currentY + 14);
    doc.line(margin + 8, currentY + 40, margin + sigBoxWidth - 8, currentY + 40);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text("Date: ________________________", margin + 8, currentY + 48);

    // Scholar / Mufti Box
    doc.rect(margin + sigBoxWidth + 20, currentY, sigBoxWidth, 54);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);
    doc.text("Islamic Scholar / Mufti Endorsement & Stamp", margin + sigBoxWidth + 28, currentY + 14);
    doc.line(margin + sigBoxWidth + 28, currentY + 40, margin + contentWidth - 8, currentY + 40);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text("Date: ________________________", margin + sigBoxWidth + 28, currentY + 48);

    // ─────────────────────────────────────────────────────────────
    // 7. PAGE NUMBERS & SECURITY FOOTER ON EVERY PAGE
    // ─────────────────────────────────────────────────────────────
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(148, 163, 184);

        // Divider
        doc.setDrawColor(226, 232, 240);
        doc.line(margin, pageHeight - 24, pageWidth - margin, pageHeight - 24);

        doc.text(
            `Page ${i} of ${totalPages}  •  Islamic Inheritance (Farā'iḍ) Distribution Report  •  Ref: ${caseId}`,
            pageWidth / 2,
            pageHeight - 12,
            { align: 'center' }
        );
    }

    // ─────────────────────────────────────────────────────────────
    // 8. SAVE & TRIGGER DOWNLOAD + CLIPBOARD COPY
    // ─────────────────────────────────────────────────────────────
    const filename = `Faraid_Distribution_Report_${selectedMadhhab.toUpperCase()}_${caseId}.pdf`;
    doc.save(filename);

    // Also copy summary text to clipboard for convenience
    copySummaryText(shares, estateValue, currencySymbol, selectedMadhhab);

    showToast(`PDF Report downloaded: ${filename}`);
}

/**
 * Copies a clean text summary of the distribution to the clipboard.
 */
function copySummaryText(shares, estateValue, currencySymbol, madhhab) {
    try {
        const textLines = [
            `=== ISLAMIC INHERITANCE (FARĀ'IḌ) DISTRIBUTION SUMMARY ===`,
            `School (Madhhab): ${madhhab.toUpperCase()}`,
            `Net Estate: ${currencySymbol}${estateValue.toLocaleString()}`,
            `-------------------------------------------------------`
        ];

        shares.forEach(s => {
            const countStr = s.count > 1 ? ` (x${s.count})` : '';
            textLines.push(`${s.name}${countStr} [${s.status}]: ${s.fracText || '-'} | Amount: ${currencySymbol}${s.totalAmount}`);
            if (s.reason) textLines.push(`  └ Condition: ${s.reason}`);
        });

        textLines.push(`=======================================================`);
        navigator.clipboard.writeText(textLines.join('\n')).catch(() => {});
    } catch (_) {}
}
