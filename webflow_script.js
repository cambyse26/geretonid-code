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

        //  PDF Footer
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

var app = new Vue({
  el: '#app',
  data() {
    return {
            organisme: "",
            listOrganismes: [],
            email: "",
            addressZip: "",
            addressCity: ""
        }
     },
       methods: {
        //
        // gestion de la modification du <input id="Organisme">
        // - maj des infos sur l'organisme selectionné dans la liste
        // sinon
        // - maj de la datalist (via listOrganismes)
        //
        organismeChanged: function(event) {
            // recupere le valeur contenu dans le input id="Organisme">
            const currentOrganisme = event.target.value;

            console.log("organismeChanged start. currentOrganisme=" + currentOrganisme + " inputCheckedAtDom:" + event);

            // clean other related inputs
            this.email = "";
            this.addressZip = "";
            this.addressCity = "";

            if (currentOrganisme.length > 0) {
                if (this.validOrganisme(currentOrganisme) === false) {

                    // organisme inconnu: propose une nouvelle list
                    this.updateListOrganismes(currentOrganisme);
                }
            }

            console.log("organismeChanged end");
        },

        //
        // verifie si l'organisme present est valide (connu)
        // - recuperation du id dans la liste pour obtenir les details (à revoir)
        //
        validOrganisme: function(currentOrganisme) {
            // TODO verifier si c'est un organisme connu (il faut une requete http get par le nom)
            // plutot que de faire un loop sur la liste dispo
            var val = currentOrganisme;
            console.log(this.listOrganismes)
            console.log("search " + val + " in " + JSON.stringify(this.listOrganismes));
            for (var i = 0; i < this.listOrganismes.length; i++) {
                console.log("compare " + val + " with " + this.listOrganismes[i].name_city);
                if (val === this.listOrganismes[i].name_city) {
                console.log("sisi94")
                console.log(this.listOrganismes[i].id)
                this.updateOrganismeDetails(this.listOrganismes[i].id);
                return true;
                }
            }
            return false;
        },

        //
        // recupere la liste des orgnismes candidats via un request http
        //
        updateListOrganismes: function(match) {
            console.log("updateListOrganismes start");
            const baseURI = 'https://api.geretonid.com/api/company/search';
            const param = { name: match };
            const headers = {
                "Authorization":  "token 32ffef7a5e2682244a84fa2a68630da15bc6575b",
                "Content-Type": "application/json",
            };
            axios.post(baseURI, param, { headers })
            .then((result) => {
                console.log("updateListOrganismes result " + JSON.stringify(result.data));
                var data = result.data;
                console.log({tt: 'ici', data: result.data,})
                for(var i=0; i< data.length; i++){
                    data[i].name_city = data[i].name + " (" + data[i].city + ")";
                }
                // maj listOrganismes (vue:data:listOrganismes) qui enclenche automatique la maj de la page
                this.listOrganismes = data;
                            console.log(data);

            })
            console.log(this.listOrganismes);
            console.log("updateListOrganismes end");
        },
        //
        // recupere le detail d'un orgnisme via un request http
        // 
        updateOrganismeDetails: function(id) {
            console.log("updateOrganismeDetails start");
            const baseURI = `https://api.geretonid.com/api/company/get/${id}`;
            const headers = {
                "Authorization":  "token 32ffef7a5e2682244a84fa2a68630da15bc6575b",
                "Content-Type": "application/json",
            };
            axios.get(baseURI, { headers })
            .then((result) => {
                console.log("updateOrganismeDetails result:" + JSON.stringify(result.data));
                this.email = result.data.email;
                this.addressZip = result.data.address.zip;
                this.addressCity = result.data.address.city;
                document.getElementById('MailorgaModal').value = this.email;
            })
            console.log("updateOrganismeDetails end");
        },
        function generatePDF($this) {
            let currentOrganisme = document.getElementById('organismeModal').value;
            const values = { ...Forms.getValues('.form-control'), ...Forms.getValues('.form-select'), currentOrganisme};
            Pdf.generate($this.srcElement.dataset.pdf, values);
        },
        }
        })

        function Gmail(event) {
            let orgaName = document.getElementById('organismeModal').value;
            let orgaMail = document.getElementById('MailorgaModal').value;
            let prenom = document.getElementById('PrenomModal').value;
            let nom = document.getElementById('NomModal').value;
            let mail = document.getElementById('MailModal').value;
            console.log(document.getElementById('MailorgaModal').value);
            console.log("test");
            document.getElementById('btn-gmail').href=`https://mail.google.com/mail/u/0/?fs=1&tf=cm&to=${orgaMail}&su=droit%20d'accès&body=${prenom}%20${nom}%0A%0A${mail}%0A%0A%0A%0A${orgaMail}%0A${orgaName}%0A%0AMadame%2C%20Monsieur%2C%0AJe%20vous%20prie%20de%20bien%20vouloir%20m%27indiquer%20si%20des%20donn%C3%A9es%20me%20concernant%20figurent%20dans%0Avos%20fichiers%20informatis%C3%A9s%20ou%20manuels.%0ADans%20l%27affirmative%2C%20je%20souhaiterais%20obtenir%20une%20copie%2C%20en%20langage%20clair%2C%20de%20l%27ensemble%0Ade%20ces%20et%20donn%C3%A9es%20%28y%20compris%20celles%20figurant%20dans%20les%20zones%20%C2%AB%20blocs-notes%20%C2%BB%20ou%20%C2%AB%0Acommentaires%20%C2%BB%29%20en%20application%20de%20l%27article%2015%20du%20R%C3%A8glement%20g%C3%A9n%C3%A9ral%20sur%20la%0Aprotection%20des%20donn%C3%A9es%20%28RGPD%29.%0AJe%20vous%20remercie%20de%20me%20faire%20parvenir%20votre%20r%C3%A9ponse%20dans%20les%20meilleurs%20d%C3%A9lais%20et%20au%0Aplus%20tard%20dans%20un%20d%C3%A9lai%20d%27un%20mois%20%C3%A0%20compter%20de%20la%20r%C3%A9ception%20de%20ma%20demande%20%28article%0A12.3%20du%20RGPD%29.%0AA%20d%C3%A9faut%20de%20r%C3%A9ponse%20de%20votre%20part%20dans%20les%20d%C3%A9lais%20impartis%20ou%20en%20cas%20de%20r%C3%A9ponse%0Aincompl%C3%A8te%20je%20me%20r%C3%A9serve%20la%20possibilit%C3%A9%20de%20saisir%20la%20Commission%20nationale%20de%0Al%27informatique%20et%20des%20libert%C3%A9s%20%28CNIL%29%20d%27une%20r%C3%A9clamation.%0AA%20toutes%20fins%20utiles%2C%20vous%20trouverez%20des%20informations%20sur%20le%20site%20internet%20de%20la%20CNIL%20%3A%0Ahttps%3A%2F%2Fwww.cnil.fr%2Ffr%2Fprofessionnels-comment-repondre-une-demande-de-droit-dac%0Aces.%0AJe%20vous%20prie%20d%27agr%C3%A9er%2C%20Madame%2C%20Monsieur%2C%20l%27expression%20de%20mes%20salutations%0Adistingu%C3%A9es.%0A%0A${prenom}%20${nom}`;
        		document.getElementById('mail').href=`mailto:${orgaMail}?subject=droit%20d'accès&body=${prenom}%20${nom}%0A%0A${mail}%0A%0A%0A%0A${orgaMail}%0A${orgaName}%0A%0AMadame%2C%20Monsieur%2C%0AJe%20vous%20prie%20de%20bien%20vouloir%20m%27indiquer%20si%20des%20donn%C3%A9es%20me%20concernant%20figurent%20dans%0Avos%20fichiers%20informatis%C3%A9s%20ou%20manuels.%0ADans%20l%27affirmative%2C%20je%20souhaiterais%20obtenir%20une%20copie%2C%20en%20langage%20clair%2C%20de%20l%27ensemble%0Ade%20ces%20et%20donn%C3%A9es%20%28y%20compris%20celles%20figurant%20dans%20les%20zones%20%C2%AB%20blocs-notes%20%C2%BB%20ou%20%C2%AB%0Acommentaires%20%C2%BB%29%20en%20application%20de%20l%27article%2015%20du%20R%C3%A8glement%20g%C3%A9n%C3%A9ral%20sur%20la%0Aprotection%20des%20donn%C3%A9es%20%28RGPD%29.%0AJe%20vous%20remercie%20de%20me%20faire%20parvenir%20votre%20r%C3%A9ponse%20dans%20les%20meilleurs%20d%C3%A9lais%20et%20au%0Aplus%20tard%20dans%20un%20d%C3%A9lai%20d%27un%20mois%20%C3%A0%20compter%20de%20la%20r%C3%A9ception%20de%20ma%20demande%20%28article%0A12.3%20du%20RGPD%29.%0AA%20d%C3%A9faut%20de%20r%C3%A9ponse%20de%20votre%20part%20dans%20les%20d%C3%A9lais%20impartis%20ou%20en%20cas%20de%20r%C3%A9ponse%0Aincompl%C3%A8te%20je%20me%20r%C3%A9serve%20la%20possibilit%C3%A9%20de%20saisir%20la%20Commission%20nationale%20de%0Al%27informatique%20et%20des%20libert%C3%A9s%20%28CNIL%29%20d%27une%20r%C3%A9clamation.%0AA%20toutes%20fins%20utiles%2C%20vous%20trouverez%20des%20informations%20sur%20le%20site%20internet%20de%20la%20CNIL%20%3A%0Ahttps%3A%2F%2Fwww.cnil.fr%2Ffr%2Fprofessionnels-comment-repondre-une-demande-de-droit-dac%0Aces.%0AJe%20vous%20prie%20d%27agr%C3%A9er%2C%20Madame%2C%20Monsieur%2C%20l%27expression%20de%20mes%20salutations%0Adistingu%C3%A9es.%0A%0A${prenom}%20${nom}`;
        }
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
