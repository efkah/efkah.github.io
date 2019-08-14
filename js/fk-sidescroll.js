var Fk = Fk || {};
Fk.SideScroll = new function () {
    let self = this;
    this.viewWidth = (window.innerWidth > 980) ? 40 : 90 ;
    this.sections = document.querySelectorAll("section");

    this.selectArticleById = function (sectionId, articleId) {
        self.selectedSectionId = sectionId;
        let section = self.sections[sectionId]
        i = 0;
        section.articles.forEach(article => {
            if (i < articleId) {
                console.log(i -articleId);
                article.style.transform = `rotate(${(i - articleId) * 5}deg) translateX(${articleId * - self.viewWidth}vw)`;
                article.style.backgroundColor = "#00000011";
                article.style.borderRadius = "1vw";
                // article.style.boxShadow = "0.1em 0.1em 0.4em #363020";
                article.style.zIndex = 1400;
            } else if (i == articleId) {
                console.log(i -articleId);
                article.style.transform = `translateX(${articleId * -self.viewWidth}vw)`;
                article.style.backgroundColor = "unset";
                article.classList.remove("sidescroll-nav-hidden");
                // article.style.boxShadow = "unset";
                article.style.zIndex = 1500;
            } else {
                console.log(i -articleId);
                article.style.transform = `rotate(${(i -articleId) * 5}deg) translateX(${articleId * - self.viewWidth}vw)`;
                article.style.backgroundColor = "#FFFFFF22";
                article.style.borderRadius = "1vw";
                article.classList.add("sidescroll-nav-hidden");
                // article.style.boxShadow = "0.1em 0.1em 0.4em #363020";
                article.style.zIndex = 1600;
            }
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
                article.style.transformOrigin = `${((articleId - 1) * - self.viewWidth)}vw ${articleId * 5}vw`;

                article.addEventListener("click", self.selectArticle, true);
                if (articleId > 0) {
                    let backButton = document.createElement("div");
                    backButton.innerText = "<";
                    backButton.classList.add("back-button");
                    backButton.classList.add("sidescroll-nav");
                    backButton.addEventListener("click", self.selectPreviousArticle, false);
                    article.appendChild(backButton);
                }
                if (articleId < section.articles.length - 1) {
                    let nextButton = document.createElement("div");
                    nextButton.innerText = ">";
                    nextButton.classList.add("next-button");
                    nextButton.classList.add("sidescroll-nav");
                    nextButton.addEventListener("click", self.selectNextArticle, false);
                    article.appendChild(nextButton);
                }
                articleId++

            });

            self.selectArticleById(sectionId, 0);
            let gridTemplateColumns = "";
            section.articles.forEach(article => {
                gridTemplateColumns += self.viewWidth + "vw ";
                article.style.transition = "all .3s ease-out";
            });
            section.style.gridTemplateColumns = gridTemplateColumns;
            sectionId++
        });
    }
    init();
}