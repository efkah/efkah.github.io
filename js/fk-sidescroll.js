var Fk = Fk || {};
Fk.SideScroll = new function () {
    let self = this;

    this.sections = document.querySelectorAll("section");

    this.selectArticleById = function (sectionId, articleId) {
        self.selectedSectionId = sectionId;
        let section = self.sections[sectionId]
        var n = section.selectedArticle - articleId;
        i = 0;
        section.articles.forEach(article => {
            if (i < articleId) {
                article.style.transform = `rotate(-5deg) translateX(${articleId * - 90}vw)`
                // article.style.zIndex = 1;
            } else if (i == articleId) {
                article.style.transform = `translateX(${articleId * -90}vw)`
                // article.style.zIndex = 1000;
            } else {
                article.style.transform = `rotate(5deg) translateX(${articleId * - 90}vw)`
                // article.style.zIndex = 1;
            }
            n++;
            i++;
        });
        section.selectedArticle = articleId;

    }

    this.selectArticle = function (event) {
        let articleId = parseInt(event.target.closest("article").dataset.index);
        let sectionId = parseInt(event.target.closest("section").dataset.index);

        self.selectArticleById(sectionId, articleId);
    }

    this.selectNextArticle = function (e) {
        let sectionId = self.selectedSectionId;
        let section = self.sections[sectionId];
        let articleId = section.selectedArticle + 1;
        self.selectArticleById(sectionId, articleId);
    }
    this.selectPreviousArticle = function (e) {
        let sectionId = self.selectedSectionId;
        let section = self.sections[sectionId];
        let articleId = section.selectedArticle - 1;
        self.selectArticleById(sectionId, articleId);
    }

    var init = function () {
        var sectionId = 0;


        self.sections.forEach(section => {
            section.articles = document.querySelectorAll(`#section${sectionId}>article`)
            let articleId = 0;
            section.selectedArticle = 0

            section.articles.forEach(article => {
                article.dataset.index = articleId;
                article.style.transformOrigin = `${((articleId - 1) * - 90) - 20}vw ${articleId * - 5}vw`;

                article.addEventListener("click", self.selectArticle, true);
                if (articleId > 0) {
                    let backButton = document.createElement("div");
                    backButton.innerText = "<";
                    backButton.classList.add("back-button");
                    backButton.addEventListener("click", self.selectPreviousArticle, false);
                    article.appendChild(backButton);
                }
                if (articleId < section.articles.length - 1) {
                    let nextButton = document.createElement("div");
                    nextButton.innerText = ">";
                    nextButton.classList.add("next-button");
                    nextButton.addEventListener("click", self.selectNextArticle, false);
                    article.appendChild(nextButton);
                }
                articleId++

            })

            self.selectArticleById(sectionId, 0);

            section.articles.forEach(article => {
                article.style.transition = "all .3s ease-out";
            });
            sectionId++
        });
    }
    init();
}