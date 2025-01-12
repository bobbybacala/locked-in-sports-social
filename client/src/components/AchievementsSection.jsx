import { MedalIcon, TrophyIcon, X } from "lucide-react"
import { useState } from "react"
import { formatDate } from "../utils/dateUtils"

const AchievementsSection = ({ userData, onSave, isOwnProfile }) => {

    // states to keep track of achievements and checking if we are editing or not
    const [achievements, setAchievements] = useState(userData.achievement || [])
    const [newAchievement, setNewAchievement] = useState({
        title: "",
        titleDesc: "",
        category: "",
        achievedFor: "",
        achievedDate: "",
    })
    const [isEditing, setIsEditing] = useState(false)

    // add, delete achievements
    const handleAddAchievement = () => {
        // check if atleast title and titleDescription added or not
        if (newAchievement.title && newAchievement.titleDesc) {
            // update the achievements using spread operator
            setAchievements([...achievements, newAchievement])

            // set the new achievement state to empty obj
            setNewAchievement({
                title: "",
                titleDesc: "",
                category: "",
                achievedFor: "",
                achievedDate: "",
            })
        }
    }

    // function to delete an achievement
    const handleDeleteAchievement = (id) => {
        // only keep the achivements that are not the given id
        setAchievements(achievements.filter((achievement) => achievement._id !== id))
    }

    // function to handle save profile after editing
    const handleSave = () => {
        console.log(achievements);
        onSave({ achievement: achievements })
        setIsEditing(false)
    }


    return (
        <div className="bg-black rounded-lg shadow p-4 mb-6">
            <h2 className="text-lg font-semibold mb-2">Achievements</h2>

            {/* map each achievement with its component */}
            {achievements.map((ach) => (
                <div key={ach._id} className=" flex items-center m-3 justify-between">

                    {/* foreach achievement */}
                    <div className="flex items-start gap-3">
                        {ach.category === 'individual' ? (
                            <MedalIcon size={20} className='mr-2 mt-1' />
                        ) : (
                            <TrophyIcon size={20} className='mr-2 mt-1' />
                        )}

                        <div className="">
                            <h3 className="text-md font-semibold">{ach.title}</h3>
                            <p className="text-sm text-neutral-500">{ach.titleDesc}</p>
                            {/* for which club / academy /solo */}
                            <p className="text-sm text-neutral-500">{ach.achievedFor}</p>
                            <p className="text-sm text-neutral-500">
                                {formatDate(ach.achievedDate)}
                            </p>
                        </div>
                    </div>

                    {/* to delete the achievement */}
                    {isEditing && (
                        <button>
                            <X size={20} className='mr-2 text-red-600' onClick={() => handleDeleteAchievement(ach._id)} />
                        </button>
                    )}
                </div>
            ))}

            {/* if its our own profile we can add achievements  */}
            {isEditing && (
                <div className="mb-4 flex flex-col justify-center gap-3">
                    {/* title */}
                    <input
                        type="text"
                        value={newAchievement.title}
                        placeholder="Title"
                        onChange={(e) => setNewAchievement({ ...newAchievement, title: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md bg-neutral-900 text-white"
                    />

                    {/* titleDescription */}
                    <textarea
                        placeholder="titleDescription"
                        rows={4}
                        value={newAchievement.titleDesc}
                        onChange={(e) => setNewAchievement({ ...newAchievement, titleDesc: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md bg-neutral-900 text-white"
                    />

                    {/* this will be a drop down menu for category solo or academy */}
                    {/* category */}
                    <select
                        value={newAchievement.category}
                        onChange={(e) => setNewAchievement({ ...newAchievement, category: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md bg-neutral-900 text-white"
                    >
                        <option value="">Select Category</option>
                        <option value="individual">Individual</option>
                        <option value="club">Club / Academy</option>
                    </select>

                    {/* for which club / academy /solo */}
                    <input
                        type="text"
                        value={newAchievement.achievedFor}
                        placeholder="Achieved For"
                        onChange={(e) => setNewAchievement({ ...newAchievement, achievedFor: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md bg-neutral-900 text-white"
                    />

                    {/* date */}
                    <input
                        type="date"
                        value={newAchievement.achievedDate}
                        onChange={(e) => setNewAchievement({ ...newAchievement, achievedDate: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md bg-neutral-900 text-white"
                    />

                    {/* button to add more achievements */}
                    <button
                        onClick={handleAddAchievement}
                        className="bg-neutral-600 text-white px-4 py-2 rounded-md mt-2 hover:bg-neutral-800"
                    >
                        Save Achievement
                    </button>
                </div>
            )}

            {/* can edit only if its our own profile and we are not editing */}
            {isOwnProfile && (
                <>
                    {isEditing ? (
                        <button
                            onClick={handleSave}
                            className="bg-red-600 text-white px-4 py-2 rounded-md mt-2 hover:bg-red-800"
                        >
                            Save Achievements
                        </button>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-neutral-700 text-white px-4 py-2 rounded-md mt-2 hover:bg-neutral-800"
                        >
                            Edit Achievements
                        </button>
                    )}
                </>
            )}

        </div>
    )
}

export default AchievementsSection
