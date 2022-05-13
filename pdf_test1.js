var options = {
    height: "calc(77vh + 150px)",
    width: "auto",
    'min-width': '575px',
    'margin-top': "5px",
};

export default {
    generate(pdf, values) {

        const doc = new jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: 'a4',
            putOnlyUsedFonts: true,
            userUnit: 1,
            precision: 2
        });

        const NP = `${values.PrenomModal} ${values.NomModal}`

        // PDF Header
        doc.setFontSize(14);
        doc.text(NP, 10, 15);
        doc.text(values.MailModal, 10, 20);
        doc.text(values.currentOrganisme, 200, 45, null, null, "right");
        doc.text(values.MailorgaModal, 200, 50, null, null, "right");
        doc.setFont('Times-Roman', 'bold');

        // PDF Content
        this.getContent(pdf, doc, values);

        // PDF Footer
        doc.text(NP, 10, 240);
        doc.addImage("/img/ProtectID_logo.242c85be.png", "PNG", 145, 280, 60, 15);
        doc.save(`${pdf}.pdf`);
    },
    preview(pdf, values, target) {

        const doc = new jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: 'a4',
            putOnlyUsedFonts: true,
            userUnit: 1,
            precision: 2
        });

        const NP = `${values.PrenomModal} ${values.NomModal}`

        // PDF Header
        doc.text(NP, 10, 20);
        doc.text(values.MailModal, 10, 26);
        doc.text(values.MailorgaModal, 95, 36, { maxWidth: 105 });
        doc.text(values.currentOrganisme, 95, 42, { maxWidth: 105 });
        doc.setFont('Times-Roman', 'bold');

        // PDF Content
        this.getContent(pdf, doc, values);

        // PDF Footer
        doc.text(NP, 10, 250);
        doc.addImage("/img/ProtectID_logo.242c85be.png", "PNG", 140, 280, 60, 15);

        // Url du blob du pdf
        let url = doc.output('bloburl');

        // créer une instance de PdfView
        let view = new PdfView(url, target, options);

        // Afficher la preview
        view.view();
    },
    previewMedical(values, target) {

        const doc = new jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: 'a4',
            putOnlyUsedFonts: true,
            userUnit: 1,
            precision: 2
        });

        const NP = `${values.Prenom10} ${values.Nom10}`

        // PDF Header
        doc.setFontSize(14);
        doc.text(NP, 10, 15);
        doc.text(values.Mail10, 10, 20);
        doc.text(values.currentOrganisme, 200, 45, null, null, "right");
        doc.text(values.Mailorga10, 200, 50, null, null, "right");
        doc.setFont('Times-Roman', 'bold');

        // PDF Content
        this.getContent('medical', doc, values);

        // PDF Footer
        doc.text(NP, 10, 240);
        doc.addImage("/img/ProtectID_logo.242c85be.png", "PNG", 145, 280, 60, 15);

        // Url du blob du pdf
        let url = doc.output('bloburl');

        // créer une instance de PdfView
        let view = new PdfView(url, target, options);

        // Afficher la preview
        view.view();
    },
    // Afficher le contenu des pdf
    getContent(pdf, doc, values) {
        let maxWidth = { maxWidth: 190 };
        switch (pdf) {
            case "acces":
                doc.text('Objet: Droit d\'accès', 10, 60, maxWidth);
                doc.setFont('Times-Roman', 'normal')
                doc.text('Madame, Monsieur,', 10, 70, maxWidth);
                doc.text('Je vous prie de bien vouloir m\'indiquer si des données me concernant figurent dans vos fichiers informatisés ou manuels.', 10, 80, maxWidth);
                doc.text('Dans l\'affirmative, je souhaiterais obtenir une copie, en langage clair, de l\'ensemble de ces et données (y compris celles figurant dans les zones « blocs-notes » ou « commentaires ») en application de l\'article 15 du Règlement général sur la protection des données (RGPD).', 10, 100, maxWidth);
                doc.text('Je vous remercie de me faire parvenir votre réponse dans les meilleurs délais et au plus tard dans un délai d\'un mois à compter de la réception de ma demande (article 12.3 du RGPD).', 10, 130, maxWidth);
                doc.text('A défaut de réponse de votre part dans les délais impartis ou en cas de réponse incomplète je me réserve la possibilité de saisir la Commission nationale de l\'informatique et des libertés (CNIL) d\'une réclamation.', 10, 155, maxWidth);
                doc.text('A toutes fins utiles, vous trouverez des informations sur le site internet de la CNIL : ', 10, 178, maxWidth);
                doc.text('https://www.cnil.fr/fr/professionnels-comment-repondre-une-demande-de-droit-dacces.', 10, 184, maxWidth);
                doc.text('Je vous prie d\'agréer, Madame, Monsieur, l\'expression de mes salutations distinguées.', 10, 200, maxWidth);
                break;
                    }
    },
}
