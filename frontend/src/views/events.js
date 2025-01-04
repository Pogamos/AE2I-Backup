import React, { useState, useEffect } from "react";
import "../css/events.css";
import "../css/cards.css";

function Events() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [ajoutPost, setAjoutPost] = useState("none");
  const [ajoutEvent, setAjoutEvent] = useState("none");
  const [slides, setSlides] = useState([]);
  const [events, setEvents] = useState([]);
  const [polls, setPolls] = useState([]);

  const role = "admin";

  const handleReload = () => {
    window.location.reload();
  };

  const recupEvent = () => {
    fetch("http://localhost:5000/api/events/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);

        const validEvents = data.events.map((element) => ({
          ...element,
          image_url: `http://localhost:5000${element.image_url}`,
        }));

        setEvents((prevEvents) => {
          const combinedEvents = [...prevEvents, ...validEvents];
          return combinedEvents;
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const envoiEvent = () => {
    const title = document.getElementById("event-title").value;
    const description = document.getElementById("description-event").value;
    const date = document.getElementById("date").value;
    const heure = document.getElementById("heure").value;
    const image = document.getElementById("image").files[0];

    const dateTime = `${date}T${heure}:00`;
    console.log(dateTime);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("date", dateTime);

    if (image) {
      formData.append("image", image);
      formData.append("image_ext", image.name.split(".").pop());
    }

    fetch("http://localhost:5000/api/events/", {
      method: "POST",
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTczNjAwMTA3MCwianRpIjoiODE1YzA0NjYtNDY3Mi00YTM2LWI0MGUtMTZhZTE0NTVlNTRhIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6IjY3NzdlNTI4MTA3MDNjNmY1NDIwYmIwMSIsIm5iZiI6MTczNjAwMTA3MCwiZXhwIjoxNzM2MDAxOTcwLCJyb2xlIjoiYWRtaW4ifQ.TuxyB0ASQMGMaX5BogM5mkG_kWygcMVMa_R9bs3aaxs",
      },
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
      })
      .then(() => {
        handleReload();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const recupPoll = () => {
    fetch("http://localhost:5000/api/polls", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);

        const validPolls = data.map((element) => element);

        setPolls((prevPolls) => {
          const combinedPolls = [...prevPolls, ...validPolls];

          return combinedPolls;
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const recupPost = () => {
    fetch("http://localhost:5000/api/posts/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const validSlides = data.posts
          .filter((element) => !element.deleted_at)
          .map((element) => element.link);

        setSlides((prevSlides) => {
          const combinedSlides = [...prevSlides, ...validSlides];

          return combinedSlides.slice(-6);
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const envoiPost = () => {
    const url = document.getElementById("url").value;
    const title = "titretest";
    const description = "descriptiontest";

    const post = {
      title: title,
      description: description,
      link: url,
    };

    fetch("http://localhost:5000/api/posts/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTczNTkxODU2OCwianRpIjoiOWQ1NDg0ZTctZWZmNC00NGZmLThhY2YtM2ZkYWYzOWQyM2ZkIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6IjY3NzdlNTI4MTA3MDNjNmY1NDIwYmIwMSIsIm5iZiI6MTczNTkxODU2OCwiZXhwIjoxNzM1OTE5NDY4LCJyb2xlIjoiYWRtaW4ifQ.RbhlIGrhnfGg4C0ytLzgPB4AEMk5YDLDNJ5NO3xzOP4",
      },
      body: JSON.stringify(post),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
      })
      .then(() => {
        handleReload();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const precedent = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const suivant = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const pollEvent = () => {
    return polls.map((element, index) => (
      <div key={index} className="card-secondary">
        <img src="../svg/poll.svg" className="card-secondary-img" alt="..." />
        <div className="card-body">
          <p className="card-secondary-text">
            Le sondage "{element.title}" - expire dans {element.description}
          </p>
        </div>
      </div>
    ));
  };

  const cardEvent = () => {
    return events.map((element, index) => (
      <div key={index} className="card-main">
        {element.image_url && <img src={element.image_url} className="card-img" alt={element.title} />}
        <div className="card-body">
          <h3 className="card-title">{element.title}</h3>
          <p className="card-time">
            {new Date(element.date).toLocaleDateString()}
          </p>
          <p className="card-text">{element.description}</p>
        </div>
      </div>
    ));
  };

  const posts = () => {
    return slides.map((element, index) => (
      <div
        key={index}
        className="insta"
        style={{ display: currentSlide === index ? "block" : "none" }}
      >
        <blockquote
          className="instagram-media"
          data-instgrm-permalink={element}
          data-instgrm-version="14"
          style={{
            background: "#FFF",
            border: 0,
            borderRadius: "3px",
            boxShadow:
              "0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)",
            margin: "1px",
            maxWidth: "540px",
            minWidth: "326px",
            padding: 0,
            width: "calc(100% - 2px)",
          }}
        >
          <p>
            <a href={element} target="_blank" rel="noopener noreferrer">
              Voir cette publication sur Instagram
            </a>
          </p>
        </blockquote>
      </div>
    ));
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//www.instagram.com/embed.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [currentSlide]);

  useEffect(() => {
    setEvents([]);
    setSlides([]);
    recupPost();
    recupEvent();
  }, []);

  return (
    <div className="events">
      <div className="banner-top">
        <h1>Actualités</h1>
      </div>
      <div className="carrousel-insta">
        <button className="insta-button-precedent" onClick={precedent}>
          &lt;&lt;
        </button>
        {posts()}
        <button className="insta-button-suivant" onClick={suivant}>
          &gt;&gt;
        </button>
        <button
          className="ajouter-post"
          style={{ display: role === "admin" ? "block" : "none" }}
          onClick={() => setAjoutPost("block")}
        >
          <h3>Ajouter un post</h3>
        </button>
      </div>
      <div className="actu">
        <button
          className="ajouter-event"
          style={{ display: role === "admin" ? "block" : "none" }}
          onClick={() => setAjoutEvent("block")}
        >
          <h3>Ajouter un événement</h3>
        </button>
        {cardEvent()}
        <div className="card-secondary">
          <img src="../svg/poll.svg" className="card-secondary-img" alt="..." />
          <div className="card-body">
            <p className="card-secondary-text">
              Le sondage “Date préférée pour le tournoi de foot?” - expire dans
              13h37min... Dépêche toi!
            </p>
          </div>
        </div>
        <div className="card-expired">
          <img src="../svg/ae2i-logo_dark.svg" className="card-img" alt="..." />
          <div className="card-body">
            <h3 className="card-title">Titre test</h3>
            <p className="card-time">Jeudi 26 Octobre | 23h-2h</p>
            <p className="card-text">
              n. Le Lorem Ipsum est le faux texte standard de l'imprimerie
              depuis les années 1500, quand un imprimeur anonyme assem
            </p>
          </div>
        </div>
      </div>
      <div className="ajout-shadow" style={{ display: ajoutEvent }}>
        <div className="ajout-event">
          <button className="fermer" onClick={() => setAjoutEvent("none")}>
            Fermer
          </button>
          <h3>Ajouter un événement</h3>
          <div className="inevent">
            <h4 htmlFor="event-title">Titre</h4>
            <input type="text" id="event-title" name="event-title" />
            <h4 htmlFor="description-event">description</h4>
            <input
              type="text"
              id="description-event"
              name="description-event"
            />
            <div className="date-event">
              <div className="block-date">
                <h4 htmlFor="date">Date</h4>
                <input type="date" id="date" name="date" />
              </div>
              <div className="block-heure">
                <h4 htmlFor="heure">Heure</h4>
                <input type="time" id="heure" name="heure" />
              </div>
            </div>
            <div className="spe-event">
              <div className="block-tags">
                <h4 htmlFor="tags">Tags</h4>
                <input type="text" id="tags" name="tags" />
              </div>
              <div className="block-prix">
                <h4 htmlFor="prix">Prix</h4>
                <input type="text" id="prix" name="prix" />
              </div>
            </div>
            <div className="block-image">
              <h4 htmlFor="image">Image</h4>
              <input
                type="file"
                id="image"
                className="input-image"
                name="image"
              />
            </div>
            <button className="enregistrer-event" onClick={envoiEvent}>
              <h3>Enregistrer l'événement</h3>
            </button>
          </div>
        </div>
      </div>
      <div className="ajout-shadow" style={{ display: ajoutPost }}>
        <div className="ajout-post">
          <button className="fermer" onClick={() => setAjoutPost("none")}>
            Fermer
          </button>
          <h3>Ajouter un post</h3>
          <div className="lien-post">
            <h4 htmlFor="url">Lien</h4>
            <input type="text" id="url" name="url" />
            <button className="ajouter" onClick={envoiPost}>
              <h3>Enregistrer le post</h3>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Events;
