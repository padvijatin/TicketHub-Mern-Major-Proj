import { Heart } from "lucide-react";
import { ListingGrid } from "../components/ListingGrid.jsx";
import { useWishlist } from "../store/wishlist.jsx";

export const Wishlist = () => {
  const { clearWishlist, isLoading, wishlistItems } = useWishlist();

  return (
    <main className="py-[3rem]">
      <section className="mx-auto w-[min(132rem,calc(100%_-_3.2rem))]">
        <div className="mb-[2.6rem] flex flex-wrap items-end justify-between gap-[1.6rem]">
          <div>
            <span className="inline-flex items-center gap-[0.8rem] rounded-full bg-[rgba(248,68,100,0.08)] px-[1.2rem] py-[0.8rem] text-[1.2rem] font-extrabold uppercase tracking-[0.08em] text-[var(--color-primary)]">
              <Heart className="h-[1.4rem] w-[1.4rem] fill-current" />
              Wishlist
            </span>
            <h1 className="mt-[1.4rem] max-w-[13ch] text-[clamp(3rem,4.4vw,5rem)] leading-[1.05] font-extrabold tracking-[-0.04em]">
              Your saved picks in one place.
            </h1>
            <p className="mt-[1.2rem] max-w-[62rem] text-[1.6rem] leading-[1.7] text-[var(--color-text-secondary)]">
              Your wishlist now syncs with your account when you are signed in, and guest saves can follow you after login.
            </p>
          </div>

          {wishlistItems.length ? (
            <button
              type="button"
              onClick={() => void clearWishlist()}
              className="inline-flex h-[4.4rem] items-center rounded-[1.4rem] border border-[rgba(248,68,100,0.18)] bg-white px-[1.6rem] text-[1.4rem] font-bold text-[var(--color-primary)] transition-colors duration-200 hover:bg-[rgba(248,68,100,0.08)]"
            >
              Clear Wishlist
            </button>
          ) : null}
        </div>

        <ListingGrid
          items={wishlistItems}
          isLoading={isLoading}
          error=""
          columnsClassName="sm:grid-cols-2 xl:grid-cols-4"
          emptyMessage="Your wishlist is empty. Tap the heart on any card to save it here."
          skeletonCount={4}
          cardSize="listing"
        />
      </section>
    </main>
  );
};
