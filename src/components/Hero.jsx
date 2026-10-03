import ProfileContent from './ProfileContent'
import SocialLinks from './SocialLinks'
import OfferCTA from './OfferCTA'
import LinkList from './LinkList'
import ShowcaseStack from './ShowcaseStack'

/*
 * Mobile follows the reference top-to-bottom: identity → offer panel → pill CTA
 * → tilted screens, in one narrow column.
 * Desktop splits the same sequence: the column on the left, the screens given
 * the room they need on the right.
 */
export default function Hero() {
  return (
    <main className="relative mx-auto grid min-h-svh w-full max-w-[1240px] grid-cols-1 items-center gap-12 px-5 pb-10 pt-[max(3.5rem,env(safe-area-inset-top))] sm:px-8 lg:grid-cols-[minmax(0,430px)_minmax(0,1fr)] lg:gap-20 lg:px-12 lg:py-16">
      <div className="mx-auto flex w-full max-w-[430px] flex-col items-center gap-7 lg:items-start">
        <ProfileContent />
        <div className="reveal" style={{ '--d': 4 }}>
          <SocialLinks />
        </div>
        <OfferCTA />
        <div className="hidden w-full lg:block">
          <LinkList />
        </div>
      </div>

      <div className="reveal-stack mx-auto w-full max-w-[430px] lg:max-w-[700px]">
        <ShowcaseStack />
      </div>

      <div className="mx-auto w-full max-w-[430px] lg:hidden">
        <LinkList start={9} />
      </div>

      <footer className="text-center text-xs text-white/35 lg:col-span-2 lg:text-left">
        © {new Date().getFullYear()} Ashutosh Jain · Designed &amp; built in-house
      </footer>
    </main>
  )
}
