import React from 'react'
import { motion } from 'framer-motion'
import { item } from '../../utils/variants'

const GridRow = ({children, className}) => {
  return (
    <motion.div variants={item} className={`w-full py-2 grid space-x-2  grid-cols-[1fr,1fr,1fr,120px,120px,120px,120px,120px,100px] ${className} items-center justify-center`}>
        {children}
    </motion.div>
  )
}

export default GridRow