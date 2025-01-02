--Table Membres
CREATE TABLE member (
    member_id SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL,
    mail_amu VARCHAR(255) NOT NULL,
    ppicture BYTEA DEFAULT NULL, --binary dans laravel
    isAdmin BOOLEAN DEFAULT FALSE NOT NULL,
    isAdherant BOOLEAN DEFAULT FALSE NOT NULL
);

--Table Posts
CREATE TABLE post (
    post_id SERIAL PRIMARY KEY,
    titre VARCHAR(255),
    description TEXT,
    link VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

--Tables sondages
CREATE TABLE poll (
    poll_id SERIAL PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    description TEXT NOT NULL
);
CREATE TABLE poll_choice (
    poll_choice_id SERIAL PRIMARY KEY,
    poll_id INT REFERENCES poll(poll_id) ON DELETE CASCADE,
    choice_text VARCHAR(255) NOT NULL
);
CREATE TABLE poll_response (
    response_id SERIAL PRIMARY KEY,
    poll_id INT REFERENCES poll(poll_id) ON DELETE CASCADE,
    member_id INT,
    choice_id INT REFERENCES poll_choice(poll_choice_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--Table Articles
CREATE TABLE article (
    article_id SERIAL PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    photo TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--Tables Panier
CREATE TABLE cart (
    cart_id SERIAL PRIMARY KEY,
    member_id INT REFERENCES member(member_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);
CREATE TABLE cart_item (
    cart_item_id SERIAL PRIMARY KEY,
    cart_id INT REFERENCES cart(cart_id) ON DELETE CASCADE,
    article_id INT REFERENCES article(article_id) ON DELETE CASCADE,
    quantity INT DEFAULT 0 NOT NULL
);

--Table Evenements
CREATE TABLE event (
    event_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--Table Staff
CREATE TABLE Staff (
    staf_id SERIAL PRIMARY KEY,
    role VARCHAR(255),
    promo VARCHAR(255),
    description TEXT,
    phone VARCHAR(20),
    mail VARCHAR(255),
    member_id INT,
    FOREIGN KEY (member_id) REFERENCES Member(member_id)
);





-- VERSION ECRITE (pas faire attention à syntaxe references etc)---------------------------------------------------------------------------------------------------------------------------------------------------------------------------

-- tables :
-- 	-Membre		(compte affilié avec AMU si possible (possibilité de rajouter staff et de relier ca avec presentation staff))
-- 	-Post 		(Annonce sur le feed (gerer integration yt et insta ?)

-- 	-Poll		(Sondage, anonyme ou public)
-- 	-Poll_choice	(option unique d'un sondage en particulier)
-- 	-Poll_response	(choix d'une option par un membre)

-- 	-Article	(Element de la boutique)
-- 	-Date		(Evenement à venir, à mettre dans un calendrier?)
-- 	-Panier		(Relatif aux articles et au membre)
-- 	-Staff ?	(Pour ceux qui ont le role staf dans membres, pour renseigner les infos en plus pour la presentation)
-- 	-


-- Member:
-- 	-member_id	(serial)	* (PRIMARY)
-- 	-Nom		(string)	*
-- 	-Prénom		(string)	*
-- 	-Mail AMU	(string)	*
-- 	-PPicture	(b64)		  (default=null)
-- 	-isAdmin	(bool)		* (default=0)
-- 	-isAdherant	(bool)		* (default=0)(à voir)

-- Post:
-- 	-post_id	(serial)	* (PRIMARY)
-- 	-Titre		(string)
-- 	-Desc		(string)
-- 	-link		(string)
-- 	-created_at	(timestamp)	
-- 	-deleted_at	(timestamp)

-- Poll:
-- 	-poll_id	(serial)	* (PRIMARY)
-- 	-Titre		(string)	*
-- 	-Desc		(string)
	
-- Poll_choice:
-- 	-poll_choice_id	(serial)	* (PRIMARY)
-- 	-poll_id	(int)		* (references poll)
-- 	-choice_text	(string)	*

-- Poll_response:
-- 	-response_id	(serial)	* (PRIMARY)
-- 	-poll_id	(int)		* (references poll)
-- 	-member_id	(int)
-- 	-choice_id	(int)		* (references poll_choice)
-- 	-created_at	(timestamp)

-- Article:
-- 	-article_id	(serial)	* (PRIMARY)
-- 	-Titre		(string)	*
-- 	-Desc		(string)	
-- 	-Price		(float)		*
-- 	-Photo		(b64)		
-- 	-created_at	(timestamp)	

-- Event:
-- 	-event_id	(serial)	* (PRIMARY)
-- 	-title		(string)	*
-- 	-desc		(string)	
-- 	-date		(Date)	*
-- 	-created_at	(timestamp)	

-- Cart:
-- 	-cart_id	(serial)	* (PRIMARY)
-- 	-member_id	(int)		* (references member)
-- 	-created_at	(timestamp)	
-- 	-deleted_at	(timestamp)	

-- Cart_item:
-- 	-cart_item_id	(serial)	* (PRIMARY)
-- 	-cart_id	(int)		* (references cart)
-- 	-article_id	(int)		* (references article)
-- 	-quantity	(int)		* (default 0)

-- Staff:
-- 	-staf_id	(serial)
-- 	-role		(string)
-- 	-promo		(string)
-- 	-desc		(string)
-- 	-phone		(string)
-- 	-mail		(string)
-- 	-member_id	(int)		* (references member)