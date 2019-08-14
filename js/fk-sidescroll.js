var Fk = Fk || {};
Fk.SideScroll = new function () {
    let self = this;
    this.viewWidth = (window.innerWidth > 980) ? 40 : 90 ;
    this.sections = document.querySelectorAll("section");

    this.selectArticleById = function (sectionId, articleId) {
        let section = self.sections[sectionId];
        self.selectedSectionId = sectionId;
        if (0 < articleId < section.articles.length - 1) {
        i = 0;
        section.articles.forEach(article => {
            if (i < articleId) {
                article.style.transform = `rotate(${(i - articleId) * 5}deg) translateX(${articleId * - self.viewWidth}vw)`;
                article.style.backgroundColor = "#00000011";
                article.style.borderRadius = "1vw";
                // article.style.boxShadow = "0.1em 0.1em 0.4em #363020";
                article.style.zIndex = 1400;
            } else if (i == articleId) {
                article.style.transform = `translateX(${articleId * -self.viewWidth}vw)`;
                article.style.backgroundColor = "unset";
                article.classList.remove("sidescroll-nav-hidden");
                // article.style.boxShadow = "unset";
                article.style.zIndex = 1500;
            } else {
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
    }

    this.selectArticle = function (e) {
    e.preventDefault();
        let articleId = parseInt(e.target.closest("article").dataset.index);
        let sectionId = parseInt(e.target.closest("section").dataset.index);

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
    
    this.dragPoint = {
            x: 0,
            y: 0
    }
    this.dragStart = function (e) {
        e = e || window.event;
        e.preventDefault();
        
        self.dragPoint.sectionId = parseInt(e.target.closest("section").dataset.index);

        let section = self.sections[self.dragPoint.sectionId];
        self.dragPoint.articleId = section.selectedArticle;
        console.info(self.dragPoint.articleId , self.dragPoint.sectionId);

        if (e.type == 'touchstart') {
            self.dragPoint.x = e.touches[0].clientX;
            self.dragPoint.y = e.touches[0].clientY;
        } else {
            self.dragPoint.x = e.clientX;
            self.dragPoint.y = e.clientY;
          document.onmouseup = self.dragEnd;
          document.onmousemove = self.dragAction;
        }
      }
    
      this.dragAction = function (e) {
        e = e || window.event;
        
        let dirX = null;
        let dirY = null;
        if (e.type == 'touchmove') {
            dirX = (e.touches[0].clientX - self.dragPoint.x) / (window.innerWidth);
            dirY = (e.touches[0].clientY - self.dragPoint.y) / (window.innerHeight);
        } else {
            if (e.clientX < self.dragPoint.x) {
                dirX = (e.clientX - self.dragPoint.x) / self.dragPoint.x;
            } else {{
                dirX = (e.clientX - self.dragPoint.x) / (window.innerWidth - self.dragPoint.x);
            }
            }
            dirY = (e.clientY - self.dragPoint.y) / (window.innerHeight - self.dragPoint.y);
        }
        
        if (-1 > dirY < 1) {
            // if (-1 > dirX < 1) {
                self.selectArticleById(self.selectedSectionId, self.dragPoint.articleId - dirX);
            // } else if (dirX <= -1) {
            //     self.selectNextArticle();
            //     self.dragPoint.articleId = null;
            //     document.onmouseup = null;
            //     document.onmousemove = null;
            // } else if (dirX >= 1) {
            //     self.selectPreviousArticle();
            //     self.dragPoint.articleId = null;
            //     document.onmouseup = null;
            //     document.onmousemove = null;
            // }
        }
      }
      
      this.dragEnd = function (e) {

    //     console.info(self.dragPoint.articleId , self.dragPoint.sectionId);
    //     let dirX = (e.clientX - self.dragPoint.x) / (window.innerWidth / 10) || 0;
    //     let dirY = (e.clientY - self.dragPoint.y) / (window.innerHeight / 10) || 0;
    //     console.log(dirX, dirY)
    //     if (-1 > dirY < 1) {
    //         if (dirX < -1) {
    //             console.log("self.selectPreviousArticle()");
    //             self.selectPreviousArticle();
    //         } else if (dirX > 1) {
    //             console.log("self.selectNextArticle()");
    //             self.selectNextArticle();
    //         }        
    //     }
        self.dragPoint.articleId = null;
        document.onmouseup = null;
        document.onmousemove = null;
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
            // Mouse events
            section.onmousedown = self.dragStart;
            
            // Touch events
            section.addEventListener('touchstart', self.dragStart);
            section.addEventListener('touchend', self.dragEnd);
            section.addEventListener('touchmove', self.dragAction);
            sectionId++
        });
    }
    init();
}