import { useState } from "react"

const AboutSection = ({ userData, onSave, isOwnProfile }) => {

    // states to get the about of user and checking if we are editing or not
    const [about, setAbout] = useState(userData.about || "")
    const [isEditing, setIsEditing] = useState(false)

    const handleSave = () => {
        onSave({ about })
        setIsEditing(false)
    }


    return (
        <div className="bg-black p-4 rounded-lg mb-6">
            <h2 className="text-lg font-semibold mb-2">About</h2>

            {/* if no about print no bio added */}
            {about === "" && <p className="p-2 text-neutral-500">No about added.</p>}

            {isOwnProfile ? (
                <>
                    {isEditing ? (
                        <div className="">

                            <textarea
                                type="text"
                                value={about}
                                onChange={(e) => setAbout(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md bg-neutral-900 text-white"
                                rows={4}
                            />
                            <button
                                onClick={handleSave}
                                className="bg-red-600 text-white px-4 py-2 rounded-md mt-2 hover:bg-red-800"
                            >
                                Save
                            </button>
                        </div>
                    ) : (
                        <div className="">
                            <p className="p-2">{about}</p>
                            <button
                                className="bg-neutral-700 text-white py-1 px-4 rounded-md  hover:bg-neutral-800 mt-4"
                                onClick={() => setIsEditing(true)}
                            >
                                Edit About
                            </button>
                        </div>

                )}

                </>
            ) : (
                <p className="p-2">{about}</p>
            )}
        </div>
    )
}

export default AboutSection
