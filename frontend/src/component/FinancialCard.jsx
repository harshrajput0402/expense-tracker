import React from 'react'

const FinancialCard = ({
    icon,
    label,
    value,
    additionalContent,
    borderColor = "",
    bgColor = "bg-white"
}) => (
    <div className={`${bgColor} rounded-xl p-5 lg:-m-2 lg:p-2 shadow-sm 
        border hover:shadow-md border-gray-100 transition-all
    ${borderColor}`}
    >
        <div className=" text-sm font-medium text-gray-600 flex items-center gap-2 ">
            {icon}
            {label}
        </div>
        <p className="mt-1 text-2xl font-semibold text-gray-800">
            {value}
        </p>
        {additionalContent
            && <div className="mt-2 text-sm text-gray-500">
                {additionalContent}
            </div>
        }

    </div>
)



export default FinancialCard