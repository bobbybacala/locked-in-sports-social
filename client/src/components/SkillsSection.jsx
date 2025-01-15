import { X } from "lucide-react"
import { useState } from "react"

const SkillsSection = ({ userData, isOwnProfile, onSave }) => {

    // states to keep track of skills and checking if we are editing or not
    const [skills, setSkills] = useState(userData.skill || [])
    const [isEditing, setIsEditing] = useState(false)
    const [newSkill, setNewSkill] = useState("")

    // to add, delete, and save the skills
    const handleAddSkill = () => {
        // if new skill is not empty and is already not in the array then only add the new skill
        if (newSkill && !skills.includes(newSkill)) {
            // add the new skill to array of skills
            setSkills([...skills, newSkill])

            // set the new skill state to empty string
            setNewSkill("")
        }
    }

    // delete a skill
    const handleDeleteSkill = (skill) => {
        // only keep the skills that are not the given skill which is to be deleted
        setSkills(skills.filter((s) => s !== skill))
    }

    // save the skills
    const handleSave = () => {
        onSave({ skill: skills })
        setIsEditing(false)
    }


    return (
        <div className="bg-black rounded-lg shadow p-4 mb-6">
            <h2 className="text-lg font-semibold mb-2 text-white">Skills</h2>

            {/* if no skills print no skills added */}
            {skills.length === 0 && <p className="text-neutral-500 p-2">No skills added.</p>}

            {skills.length > 0 && (
                <>
                    <div className="flex flex-wrap gap-3 p-3">

                        {/* display the skills */}
                        {skills.map((skill, index) => (
                            <span
                                key={index}
                                className="bg-neutral-900 text-white text-lg rounded-md py-1 px-4 hover:cursor-pointer items-center flex hover:shadow-all-sides hover:shadow-gray-800"
                            >
                                {skill}
                                {isEditing && (
                                    <button
                                        onClick={() => handleDeleteSkill(skill)}
                                        className="ml-2"
                                    >
                                        <X size={20} className="text-red-500 hover:bg-red-900 rounded-md" />
                                    </button>
                                )}
                            </span>
                        ))}
                    </div>


                    {/* add the skill if editing */}
                    {isEditing && (
                        <div className="space-y-4 mt-6">
                            <input
                                type="text"
                                placeholder="New Skill"
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md bg-neutral-900 text-white"
                            />

                            <button
                                onClick={handleAddSkill}
                                className="bg-neutral-700 text-white px-4 py-2 rounded-md hover:bg-neutral-800"
                            >
                                Add Skill
                            </button>
                        </div>
                    )}

                </>
            )}

            {/* if its our own profile we can add and save the skills */}
            {isOwnProfile && (
                <>
                    {isEditing ? (
                        <button
                            onClick={handleSave}
                            className="bg-red-600 text-white px-4 py-2 rounded-md mt-2 hover:bg-red-800"
                        >
                            Save Skills
                        </button>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-neutral-700 text-white px-4 py-1 rounded-md mt-5 hover:bg-neutral-800"
                        >
                            Edit Skills
                        </button>
                    )}
                </>
            )}
        </div>
    )
}

export default SkillsSection
