import { profile } from '../config/site'

export default function ProfileContent() {
  const initial = profile.name[0]
  return (
    <header className="flex flex-col items-center text-center lg:items-start lg:text-left">
      <div className="reveal avatar-ring relative size-[76px] rounded-full p-[1.5px]" style={{ '--d': 0 }}>
        {profile.avatar ? (
          <img src={profile.avatar} alt={`${profile.name} ${profile.surname}`} className="size-full rounded-full object-cover" width="76" height="76" />
        ) : (
          // Placeholder until public/media/avatar.jpg is provided.
          <div className="grid size-full place-items-center rounded-full bg-[#0b0b10] text-2xl font-semibold text-white/90">{initial}</div>
        )}
        <span className="absolute bottom-1 right-1 size-3 rounded-full border-2 border-[#050507] bg-emerald-400" title="Taking projects" />
      </div>

      <h1 className="reveal mt-5 text-[2rem] font-semibold leading-[1.1] tracking-[-0.02em] lg:text-[2.75rem]" style={{ '--d': 1 }}>
        <span className="text-white">{profile.name}</span> <span className="text-white/60">{profile.surname}</span>
      </h1>
      <p className="reveal mt-1.5 text-sm font-medium text-white/45" style={{ '--d': 2 }}>{profile.handle}</p>

      <p className="reveal mt-5 max-w-[34ch] text-[15px] leading-[1.65] lg:text-base" style={{ '--d': 3 }}>
        <span className="text-white">{profile.bio.lead}</span>
        <span className="text-white/60">{profile.bio.rest}</span>
      </p>
    </header>
  )
}
