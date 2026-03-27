import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { A11y, Autoplay, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";

const fallbackByType = {
  movie: "bg-[linear-gradient(135deg,#181032_0%,#7b3fe4_52%,#f84464_100%)]",
  sports: "bg-[linear-gradient(135deg,#0f172a_0%,#0f766e_52%,#22c55e_100%)]",
  event: "bg-[linear-gradient(135deg,#1c1c1c_0%,#7b3fe4_46%,#f84464_100%)]",
};

const formatDate = (value) => {
  if (!value) {
    return "Date to be announced";
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return parsedDate.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
};

const formatPrice = (value) => {
  if (typeof value === "number") {
    return `Rs ${new Intl.NumberFormat("en-IN").format(value)} onwards`;
  }

  if (typeof value === "string" && value.trim()) {
    return value;
  }

  return "Price soon";
};

const getLocation = (item) => item.venue || item.city || item.location || "Venue update soon";

const getBannerLink = (item) => (item.id ? `/event/${item.id}` : item.to || "/events");

const HeroSlide = ({ item, type }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const image = item.poster || item.image || "";
  const fallbackClassName = fallbackByType[type] || fallbackByType.event;

  return (
    <article
      className={`relative h-[34rem] overflow-hidden rounded-[2.8rem] md:h-[44rem] ${fallbackClassName}`}
    >
      {!imageFailed && image ? (
        <>
          <img
            src={image}
            alt={item.title}
            className="absolute inset-0 h-full w-full scale-[1.06] object-cover blur-[18px]"
            onError={() => setImageFailed(true)}
          />
          <div className="absolute inset-0 bg-[rgba(255,255,255,0.84)] backdrop-blur-[18px]" />
        </>
      ) : (
        <div className="absolute inset-0 bg-[rgba(255,255,255,0.88)]" />
      )}

      <div className="relative z-10 grid h-full items-center gap-[2rem] p-[2rem] md:grid-cols-[1.15fr_0.75fr] md:px-[7rem] md:py-[3.6rem]">
        <div className="pr-[0.8rem]">
          <p className="text-[1.7rem] font-semibold text-[var(--color-text-primary)] md:text-[1.9rem]">
            {formatDate(item.date)}
          </p>
          <h2 className="mt-[1.6rem] max-w-[14ch] text-[clamp(3rem,4.2vw,5.6rem)] font-extrabold leading-[1.08] tracking-[-0.04em] text-[var(--color-text-primary)]">
            {item.title}
          </h2>
          <p className="mt-[1.4rem] flex items-center gap-[0.7rem] text-[1.6rem] font-semibold text-[var(--color-text-primary)] md:text-[1.8rem]">
            <MapPin className="h-[1.8rem] w-[1.8rem] text-[var(--color-primary)]" />
            <span className="truncate">{getLocation(item)}</span>
          </p>
          <p className="mt-[1.8rem] text-[1.7rem] font-bold text-[var(--color-text-primary)]">
            {formatPrice(item.price)}
          </p>

          <Link
            to={getBannerLink(item)}
            className="mt-[2.2rem] inline-flex items-center rounded-[1.6rem] bg-[var(--color-button-dark)] px-[2.2rem] py-[1.3rem] text-[1.7rem] font-bold text-white transition-colors duration-200 hover:bg-[var(--color-primary)]"
          >
            Book tickets
          </Link>
        </div>

        <div className="hidden justify-self-end md:block">
          <div className="overflow-hidden rounded-[2.2rem] shadow-[0_20px_44px_rgba(15,23,42,0.12)]">
            {!imageFailed && image ? (
              <img
                src={image}
                alt={item.title}
                className="h-[31rem] w-[36rem] object-cover"
                onError={() => setImageFailed(true)}
              />
            ) : (
              <div className={`h-[31rem] w-[36rem] ${fallbackClassName}`} />
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export const PageHeroCarousel = ({ items = [], type = "event" }) => {
  const [swiper, setSwiper] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setIsReady(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  if (!items.length) {
    return null;
  }

  return (
    <section
      className={`relative mb-[3rem] transition-all duration-500 ease-out ${
        isReady ? "translate-y-0 opacity-100" : "translate-y-[1.6rem] opacity-0"
      }`}
    >
      <Swiper
        modules={[A11y, Autoplay, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop={items.length > 1}
        speed={700}
        autoplay={
          items.length > 1
            ? {
                delay: 5000,
                disableOnInteraction: false,
              }
            : false
        }
        onSwiper={setSwiper}
        onSlideChange={(instance) => setActiveIndex(instance.realIndex)}
        className="h-[34rem] overflow-hidden rounded-[2.8rem] md:h-[44rem]"
      >
        {items.map((item) => (
          <SwiperSlide key={item.id || item.title} className="h-full">
            <HeroSlide item={item} type={type} />
          </SwiperSlide>
        ))}
      </Swiper>

      {items.length > 1 ? (
        <>
          <button
            type="button"
            onClick={() => swiper?.slidePrev()}
            className="absolute left-[1.2rem] top-1/2 z-10 hidden h-[4.2rem] w-[4.2rem] -translate-y-1/2 items-center justify-center rounded-full border border-white/18 bg-white/12 text-white backdrop-blur-[12px] transition-colors duration-200 hover:bg-white/20 md:inline-flex"
            aria-label="Previous banner"
          >
            <ChevronLeft className="h-[2rem] w-[2rem]" />
          </button>
          <button
            type="button"
            onClick={() => swiper?.slideNext()}
            className="absolute right-[1.2rem] top-1/2 z-10 hidden h-[4.2rem] w-[4.2rem] -translate-y-1/2 items-center justify-center rounded-full border border-white/18 bg-white/12 text-white backdrop-blur-[12px] transition-colors duration-200 hover:bg-white/20 md:inline-flex"
            aria-label="Next banner"
          >
            <ChevronRight className="h-[2rem] w-[2rem]" />
          </button>

          <div className="absolute bottom-[1.8rem] left-1/2 z-10 flex -translate-x-1/2 gap-[0.8rem]">
            {items.map((item, index) => (
              <button
                key={`${item.id || item.title}-dot`}
                type="button"
                onClick={() => swiper?.slideToLoop(index)}
                className={`h-[1rem] rounded-full transition-all duration-200 ${
                  index === activeIndex
                    ? "w-[3.2rem] bg-[var(--color-button-dark)]"
                    : "w-[1rem] bg-[rgba(28,28,28,0.2)]"
                }`}
                aria-label={`Go to banner ${index + 1}`}
              />
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
};
