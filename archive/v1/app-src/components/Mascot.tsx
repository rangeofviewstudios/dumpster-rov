export type MascotPose = 'peek' | 'dig' | 'hold' | 'sleep' | 'wave'

export function brandUrl(file: string): string {
  return `${import.meta.env.BASE_URL}brand/${file}`
}

interface MascotProps {
  pose: MascotPose
  size?: number
  className?: string
}

export function Mascot({ pose, size = 96, className }: MascotProps) {
  return <img className={className} src={brandUrl(`mascot-${pose}.svg`)} width={size} height={size} alt="" draggable={false} />
}
