'use client'

import AiExistFalse from "./existFalse/page";
import AiExistTrue from "./existTrue/page";

export default function aiExist() {
    return (
        <div className="w-full h-full flex justify-center">
            <div className="w-full h-full"><AiExistTrue /></div>
        </div>
    )
}