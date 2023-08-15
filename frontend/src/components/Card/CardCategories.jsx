import React from 'react'
import { motion } from 'framer-motion'
import { BASE_URL } from '../../redux/constants'


const CardCategories = ({img, text, description,variant}) => {
  return (
    <motion.div variants={variant} className='w-[333px] dark:bg-slate-800 backdrop-filter backdrop-blur-lgoverflow-hidden p-2 h-[75px] rounded mb-3 mr-4 text-base bg-slate-200 flex items-center space-x-2'>
        <img className='w-16 h-16 object-contain' src={BASE_URL+"/"+ img} alt="" />
        <div >
            <p className='font-medium'>{text}</p>
            
        </div>
    </motion.div>
  )
}

export default CardCategories