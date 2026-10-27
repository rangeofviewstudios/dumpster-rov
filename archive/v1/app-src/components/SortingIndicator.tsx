import { motion } from 'framer-motion'
import { Mascot } from './Mascot'

export function SortingIndicator({ label = 'Scraps is sorting…' }: { label?: string }) {
  return (
    <motion.div
      className="sorting"
      role="status"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.14 }}
    >
      <Mascot pose="dig" size={36} className="sorting__mascot" />
      <span className="t-small">{label}</span>
      <span className="dots" aria-hidden="true"><i /><i /><i /></span>
    </motion.div>
  )
}
