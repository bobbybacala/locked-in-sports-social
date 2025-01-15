import {  BicepsFlexed, X } from "lucide-react"
import { useState } from "react"
import { formatDate } from "../utils/dateUtils"

const ExperienceSection = ({ userData, onSave, isOwnProfile }) => {

    // we will need some states to keep track of the experience and new experience being added and that we are editing the form or not
    const [experiences, setExperiences] = useState(userData.experience || [])
    const [newExperience, setNewExperience] = useState({
        title: "",
        institute: "",
        desc: "",
        startDate: "",
        endDate: "",
        currentlyAt: false
    })
    const [isEditing, setIsEditing] = useState(false)

    // function to add a new experience
    const handleAddExperience = () => {
        if (newExperience.title && newExperience.institute && newExperience.startDate) {
            // update the experiences using spread operator
            setExperiences([...experiences, newExperience])

            // again set the newExperience state to empty obj
            setNewExperience({
                title: "",
                institute: "",
                desc: "",
                startDate: "",
                endDate: "",
                currentlyAt: false
            })
        }
    }

    // function to delete an experience
    const handleDeleteExperience = (id) => {
        // only keep the exps which are not the given id
        setExperiences(experiences.filter((exp) => exp._id !== id))
    }

    // to save
    const handleSave = () => {
        onSave({ experience: experiences })
        setIsEditing(false)
    }

    const handleCurrentlyAtChange = (e) => {
        setNewExperience({
            ...newExperience,
            // if we have checked it, this becomes true else false
            currentlyAt: e.target.checked,
            endDate: e.target.checked ? "" : newExperience.endDate
        })
    }

    return (
        <div className="bg-black rounded-lg shadow p-4 mb-6">
            <h2 className="text-lg font-semibold mb-2 text-white">Experience</h2>

            {/* if no experience print no experience added */}
            {experiences.length === 0 && <p className="p-2 text-neutral-500">No experience added.</p>}

            {/* if its our own profile we can add achievements  */}
            {experiences.map((exp) => (
                <div key={exp._id} className="flex items-center m-3 justify-between">
                    {/* the experience */}
                    <div className="flex items-start gap-3">
                        <BicepsFlexed size={20} className='mr-2 mt-1' />
                        <div className="">
                            <h3 className="font-bold">{exp.title}</h3>
                            <p className="">{exp.institute}</p>
                            <p className="text-sm text-neutral-500">
                                {formatDate(exp.startDate)} - {exp.currentlyAt ? "Present" : formatDate(exp.endDate)}
                            </p>
                            <p className="text-sm text-neutral-500">{exp.desc}</p>
                        </div>
                    </div>

                    {/* delete exp button */}
                    {isEditing && (
                        <button>
                            <X size={20} className='mr-2 text-red-600' onClick={() => handleDeleteExperience(exp._id)} />
                        </button>
                    )}
                </div>
            ))}

            {/* when editing we can add new experience */}
            {isEditing && (
                <div className="mt-4 flex flex-col gap-4">
                    {/* title */}
                    <input
                        type="text"
                        placeholder="Title"
                        value={newExperience.title}
                        onChange={(e) => setNewExperience({ ...newExperience, title: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md bg-neutral-900 text-white"
                    />

                    {/* institute */}
                    <input
                        type="text"
                        placeholder="Institute"
                        value={newExperience.institute}
                        onChange={(e) => setNewExperience({ ...newExperience, institute: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md bg-neutral-900 text-white"
                    />

                    {/* description */}
                    <textarea
                        type="text"
                        placeholder="Description"
                        value={newExperience.desc}
                        onChange={(e) => setNewExperience({ ...newExperience, desc: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md bg-neutral-900 text-white"
                        rows={4}
                    />

                    {/* start date */}
                    <input
                        type="date"
                        value={newExperience.startDate}
                        onChange={(e) => setNewExperience({ ...newExperience, startDate: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md bg-neutral-900 text-white"
                    />

                    {/* check box to tell currentlyAt or not  */}
                    <div className="flex items-center mb-2">
                        <input
                            type="checkbox"
                            checked={newExperience.currentlyAt}
                            id="currentlyAt"
                            onChange={handleCurrentlyAtChange}
                            className="mr-2"
                        />
                        <label htmlFor="currentlyAt">Im Currently Playing Here</label>
                    </div>

                    {/* is not currently at we can add end date */}
                    {!newExperience.currentlyAt && (
                        <input
                            type="date"
                            value={newExperience.endDate}
                            onChange={(e) => setNewExperience({ ...newExperience, endDate: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-md bg-neutral-900 text-white"
                        />
                    )}

                    <button
						onClick={handleAddExperience}
						className='bg-neutral-700 text-white py-2 px-4 rounded hover:bg-neutral-800 transition duration-300'
					>
						Save Experience
					</button>
                </div>
            )}

            {/* if its our own profile we can add experiences */}
            {isOwnProfile && (
                <>
                    {isEditing ? (
                        <button
                            onClick={handleSave}
                            className="mt-4 bg-red-700 text-white py-2 px-4 rounded hover:bg-red-900 transition duration-300">
                            Save Changes
                        </button>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="mt-4 bg-neutral-700 text-white py-1 px-4 rounded hover:bg-neutral-800 "
                        >
                            Edit Experiences
                        </button>
                    )}
                </>
            )}

        </div>
    )
}

export default ExperienceSection
