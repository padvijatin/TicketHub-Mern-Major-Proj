import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { A11y, Autoplay, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import { ListingGrid } from "../components/ListingGrid.jsx";
import { getEvents } from "../utils/eventApi.js";

const heroFallbackByType = {
  movie: "bg-[linear-gradient(135deg,#181032_0%,#7b3fe4_52%,#f84464_100%)]",
  sports: "bg-[linear-gradient(135deg,#0f172a_0%,#0f766e_52%,#22c55e_100%)]",
  event: "bg-[linear-gradient(135deg,#1c1c1c_0%,#7b3fe4_46%,#f84464_100%)]",
};

const HeroSlide = ({ slide }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const fallbackClassName = heroFallbackByType[slide.contentType] || heroFallbackByType.event;

  return (
    <section className={`relative h-[34rem] overflow-hidden rounded-[2.8rem] md:h-[44rem] ${fallbackClassName}`}>
      {!imageFailed && slide.poster ? (
        <img
          src={slide.poster}
          alt={slide.title}
          className="absolute inset-0 h-full w-full object-cover"
          onError={() => setImageFailed(true)}
        />
      ) : null}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(28,28,28,0.86)_0%,rgba(28,28,28,0.48)_44%,rgba(28,28,28,0.1)_100%)]" />

      <div className="relative z-10 flex h-full flex-col justify-end p-[2.4rem] text-[var(--color-text-light)] md:p-[4rem]">
        <h2 className="max-w-[11ch] text-[clamp(3rem,4.4vw,5.4rem)] leading-[1.03] font-extrabold tracking-[-0.04em]">
          {slide.title}
        </h2>
        <p className="mt-[1.2rem] max-w-[52rem] text-[1.5rem] leading-[1.75] text-white/88 md:text-[1.7rem]">
          {slide.subtitle}
        </p>
        <Link
          to={slide.to}
          className="mt-[2rem] inline-flex w-fit items-center rounded-[1.4rem] bg-[var(--color-primary)] px-[1.8rem] py-[1.2rem] text-[1.4rem] font-bold text-[var(--color-text-light)] transition-all duration-200 hover:bg-[var(--color-primary-hover)] md:text-[1.5rem]"
        >
          {slide.cta}
        </Link>
      </div>
    </section>
  );
};

export const Home = () => {
  const [swiper, setSwiper] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [homeEvents, setHomeEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const loadHomeEvents = async () => {
      setIsLoading(true);
      setError("");

      try {
        const eventData = await getEvents({ limit: 6 });

        if (!ignore) {
          setHomeEvents(eventData);
        }
      } catch (fetchError) {
        if (!ignore) {
          setError("Unable to load TicketHub events right now.");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    loadHomeEvents();

    return () => {
      ignore = true;
    };
  }, []);

  const heroSlides = useMemo(() => homeEvents.slice(0, 3), [homeEvents]);
  const featuredEvents = useMemo(() => {
    if (homeEvents.length > 3) {
      return homeEvents.slice(3, 6);
    }

    return homeEvents.slice(0, 3);
  }, [homeEvents]);

  const hasSlides = heroSlides.length > 0;

  return (
    <main className="py-[3rem]">
      <section className="mx-auto w-[min(120rem,calc(100%_-_3.2rem))]">
        <div className="relative">
          {hasSlides ? (
            <>
              <Swiper
                className="overflow-hidden rounded-[2.8rem]"
                modules={[A11y, Autoplay, EffectFade]}
                effect="fade"
                loop={heroSlides.length > 1}
                speed={700}
                autoplay={
                  heroSlides.length > 1
                    ? {
                        delay: 5000,
                        disableOnInteraction: false,
                      }
                    : false
                }
                onSwiper={setSwiper}
                onSlideChange={(instance) => setActiveIndex(instance.realIndex)}
              >
                {heroSlides.map((slide) => (
                  <SwiperSlide key={slide.id}>
                    <HeroSlide slide={slide} />
                  </SwiperSlide>
                ))}
              </Swiper>

              {heroSlides.length > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={() => swiper?.slidePrev()}
                    className="absolute left-[1.2rem] top-1/2 z-10 hidden h-[4.2rem] w-[4.2rem] -translate-y-1/2 items-center justify-center rounded-full border border-white/18 bg-white/12 text-white backdrop-blur-[12px] transition-colors duration-200 hover:bg-white/20 md:inline-flex"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="h-[2rem] w-[2rem]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => swiper?.slideNext()}
                    className="absolute right-[1.2rem] top-1/2 z-10 hidden h-[4.2rem] w-[4.2rem] -translate-y-1/2 items-center justify-center rounded-full border border-white/18 bg-white/12 text-white backdrop-blur-[12px] transition-colors duration-200 hover:bg-white/20 md:inline-flex"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="h-[2rem] w-[2rem]" />
                  </button>

                  <div className="absolute bottom-[1.6rem] left-1/2 z-10 flex -translate-x-1/2 gap-[0.8rem]">
                    {heroSlides.map((slide, index) => (
                      <button
                        key={slide.id}
                        type="button"
                        onClick={() => swiper?.slideToLoop(index)}
                        className={`h-[0.9rem] rounded-full transition-all duration-200 ${
                          index === activeIndex
                            ? "w-[3rem] bg-[var(--color-primary)]"
                            : "w-[0.9rem] bg-white/55"
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              ) : null}
            </>
          ) : (
            <section className="flex h-[34rem] items-end overflow-hidden rounded-[2.8rem] bg-[linear-gradient(135deg,#171717_0%,#7b3fe4_48%,#f84464_100%)] p-[2.4rem] text-[var(--color-text-light)] md:h-[44rem] md:p-[4rem]">
              <div>
                <h2 className="max-w-[11ch] text-[clamp(3rem,4.4vw,5.4rem)] leading-[1.03] font-extrabold tracking-[-0.04em]">
                  {isLoading ? "Loading live events..." : "No live events available yet."}
                </h2>
                <p className="mt-[1.2rem] max-w-[52rem] text-[1.5rem] leading-[1.75] text-white/88 md:text-[1.7rem]">
                  {error || "Add active records to your existing events collection and they will appear here automatically."}
                </p>
              </div>
            </section>
          )}
        </div>

        <div className="mt-[2.6rem]">
          <ListingGrid
            items={featuredEvents}
            isLoading={isLoading}
            error={error}
            columnsClassName="sm:grid-cols-2 lg:grid-cols-3"
            emptyMessage="No featured events are available from the database yet."
            skeletonCount={3}
          />
        </div>
      </section>
    </main>
  );
};
