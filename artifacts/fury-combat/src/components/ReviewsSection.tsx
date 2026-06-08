const reviews = [
  {
    name: 'Carl Henry Goss',
    text: '\u201CSince joining Fury Combat and training in Jiu Jitsu and Kickboxing, I wake up full of energy, my mood is always elevated and I feel that there is nothing that I can\u2019t accomplish.\u201D',
  },
  {
    name: 'Bessie Gilreath',
    text: '\u201CAs a woman living in Brooklyn I feel a lot safer walking home since I learned mixed martial arts at Fury Combat Systems. Dr Fury\u2019s system is the best to teach a person how to avoid becoming a victim.\u201D',
  },
  {
    name: 'Brian Moskalis',
    text: '\u201CI sent my two kids to take martial arts. They needed to learn how not to be bullied and how not to be a bully. Dr. Furie\u2019s training teaches them to use common sense first and self defense if required.\u201D',
  },
  {
    name: 'Jennifer Reese Smith',
    text: '\u201CI needed to learn to feel safe when I went shopping or walked to my car in a dark parking lot. Now I feel I could have much less of a chance to become a victim. Fury Combat really helped me.\u201D',
  },
  {
    name: 'Mary Mayrenza',
    text: '\u201CI want to personally thank Dr. Furie and his staff for helping my son to overcome his lack of self confidence. His training in Jiu Jitsu has made him walk and talk like someone who is bold.\u201D',
  },
  {
    name: 'Jacob Manuello Cook',
    text: '\u201CI enrolled in the kickboxing class at Fury Combat. Not only did I learn how to stand up to anyone but I am in the best physical shape of my life and I am over 40.\u201D',
  },
  {
    name: 'Clifford Todd McKinney',
    text: '\u201CThey did not only teach her self defense but awareness, which is just as valuable. My wife looks great, feels great and I feel better when she is out by herself.\u201D',
  },
  {
    name: 'Julia Zenita',
    text: '\u201CWhen I heard about Dr. Furies and his methods I switched. Now I am growing in both the physical and mental areas of the sport. The extra drive to Brooklyn is well worth it.\u201D',
  },
  {
    name: 'Tracy Hudson',
    text: '\u201CI signed up for the mixed martial arts training at Fury Combat in Brooklyn. It has only been a few weeks but I feel a big difference in my mental attitude already.\u201D',
  },
  {
    name: 'Bobby Arnold',
    text: '\u201CWith the teaching from Dr. Fury I have improved more in this short time than my entire time at the other program.\u201D',
  },
  {
    name: 'Bob Keating',
    text: '\u201CFury Combat Systems has great training courses for all ages. I highly recommend Fury Combat Systems.\u201D',
  },
];

function ReviewCard({ name, text, ariaHidden }: { name: string; text: string; ariaHidden?: boolean }) {
  return (
    <article className="david_review_card" aria-hidden={ariaHidden ? 'true' : undefined}>
      <div className="david_review_header">
        <div>
          <h3 className="david_review_name">{name}</h3>
          <p className="david_review_meta">Google review</p>
        </div>
        <div className="david_google_badge">G</div>
      </div>
      <div className="david_reviews_stars">{'\u2605\u2605\u2605\u2605\u2605'}</div>
      <p className="david_review_text">{text}</p>
    </article>
  );
}

export default function ReviewsSection() {
  return (
    <section className="david_reviews_section" aria-labelledby="david_reviews_title">
      <style>{`
    .david_reviews_section {
      width: 100%;
      padding: 70px 18px;
      background: radial-gradient(circle at top, #242424 0%, #111111 45%, #070707 100%);
      color: #ffffff;
      overflow: hidden;
      box-sizing: border-box;
    }

    .david_reviews_inner {
      max-width: 1220px;
      margin: 0 auto;
      text-align: center;
    }

    .david_reviews_kicker {
      margin: 0 0 10px;
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: #d7b56d;
      font-weight: 900;
    }

    .david_reviews_title {
      margin: 0;
      font-family: 'Cinzel', serif;
      font-weight: 900;
      font-size: clamp(32px, 5.5vw, 64px);
      line-height: 1.05;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: #ffffff;
    }

    .david_reviews_subtitle {
      max-width: 780px;
      margin: 18px auto 28px;
      font-family: 'Inter', sans-serif;
      font-size: clamp(16px, 2vw, 20px);
      line-height: 1.55;
      color: #d9d9d9;
    }

    .david_reviews_rating_bar {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 14px;
      margin: 0 auto 38px;
      padding: 13px 20px;
      border: 1px solid rgba(215, 181, 109, 0.52);
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.07);
      box-shadow: 0 14px 35px rgba(0, 0, 0, 0.24);
      font-family: 'Inter', sans-serif;
    }

    .david_reviews_stars {
      color: #f6c744;
      letter-spacing: 2px;
      font-size: 18px;
      line-height: 1;
      white-space: nowrap;
    }

    .david_reviews_score {
      color: #ffffff;
      font-size: 15px;
      font-weight: 900;
    }

    .david_reviews_scroller {
      position: relative;
      width: 100%;
      overflow: hidden;
      padding: 8px 0 12px;
      mask-image: linear-gradient(to right, transparent, black 7%, black 93%, transparent);
      -webkit-mask-image: linear-gradient(to right, transparent, black 7%, black 93%, transparent);
    }

    .david_reviews_track {
      display: flex;
      gap: 18px;
      width: max-content;
      animation: david_reviews_scroll 65s linear infinite;
    }

    .david_reviews_scroller:hover .david_reviews_track {
      animation-play-state: paused;
    }

    .david_review_card {
      width: 355px;
      min-height: 285px;
      padding: 24px;
      border-radius: 20px;
      background: linear-gradient(180deg, #1d1d1d 0%, #131313 100%);
      border: 1px solid rgba(255, 255, 255, 0.13);
      box-shadow: 0 20px 48px rgba(0, 0, 0, 0.34);
      text-align: left;
      box-sizing: border-box;
      font-family: 'Inter', sans-serif;
    }

    .david_review_header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      margin-bottom: 14px;
    }

    .david_review_name {
      margin: 0;
      font-size: 18px;
      line-height: 1.25;
      font-weight: 900;
      color: #ffffff;
    }

    .david_review_meta {
      margin: 5px 0 0;
      font-size: 13px;
      line-height: 1.35;
      color: #a9a9a9;
    }

    .david_google_badge {
      width: 40px;
      height: 40px;
      min-width: 40px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      background: #ffffff;
      color: #111111;
      font-size: 18px;
      font-weight: 900;
    }

    .david_review_card .david_reviews_stars {
      margin: 0 0 13px;
      font-size: 15px;
    }

    .david_review_text {
      margin: 0;
      font-size: 15.5px;
      line-height: 1.58;
      color: #eeeeee;
    }

    .david_reviews_cta_area {
      margin-top: 38px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 14px;
      flex-wrap: wrap;
    }

    .david_reviews_button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 50px;
      padding: 0 24px;
      border-radius: 999px;
      border: 2px solid #dc2626;
      background: #dc2626;
      color: #ffffff;
      font-family: 'Inter', sans-serif;
      font-size: 15px;
      font-weight: 900;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      text-decoration: none;
      transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease;
    }

    .david_reviews_button:hover {
      transform: translateY(-2px);
      background: #b91c1c;
      border-color: #b91c1c;
      color: #ffffff;
    }

    .david_reviews_button.secondary {
      border-color: #ea580c;
      background: #ea580c;
      color: #ffffff;
    }

    .david_reviews_button.secondary:hover {
      background: #c2410c;
      border-color: #c2410c;
      color: #ffffff;
    }

    @keyframes david_reviews_scroll {
      from {
        transform: translateX(0);
      }

      to {
        transform: translateX(-50%);
      }
    }

    @media (max-width: 760px) {
      .david_reviews_section {
        padding: 52px 14px;
      }

      .david_reviews_rating_bar {
        flex-direction: column;
        gap: 7px;
        border-radius: 18px;
      }

      .david_reviews_scroller {
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        mask-image: none;
        -webkit-mask-image: none;
        padding-bottom: 16px;
      }

      .david_reviews_track {
        animation: none;
        width: auto;
      }

      .david_review_card {
        width: 84vw;
        min-width: 84vw;
        min-height: 300px;
        scroll-snap-align: center;
      }
    }
      `}</style>

      <div className="david_reviews_inner">
        <p className="david_reviews_kicker">Google Reviews</p>

        <h2 className="david_reviews_title" id="david_reviews_title">
          Students Trust David Fury
        </h2>

        <p className="david_reviews_subtitle">
          Real students and parents talk about confidence, discipline, self defense, Jiu Jitsu, kickboxing, and the life changing impact of training with Dr. Fury.
        </p>

        <div className="david_reviews_rating_bar" aria-label="Fury Combat Systems Google rating">
          <span className="david_reviews_stars" aria-hidden="true">{'\u2605\u2605\u2605\u2605\u2605'}</span>
          <span className="david_reviews_score">4.9 rating from 23 Google reviews</span>
        </div>

        <div className="david_reviews_scroller" aria-label="Scrolling Google review cards">
          <div className="david_reviews_track">
            {reviews.map((r) => (
              <ReviewCard key={r.name} name={r.name} text={r.text} />
            ))}
            {reviews.map((r) => (
              <ReviewCard key={`dup-${r.name}`} name={r.name} text={r.text} ariaHidden />
            ))}
          </div>
        </div>

        <div className="david_reviews_cta_area">
          <a
            className="david_reviews_button"
            href="https://www.google.com/search?kgmid=/g/119w2108z&q=Fury+Combat+Systems#lrd="
            target="_blank"
            rel="noopener noreferrer"
          >
            Read More Reviews
          </a>

          <a className="david_reviews_button secondary" href="tel:9173402911">
            Book A Free Class
          </a>
        </div>
      </div>
    </section>
  );
}
