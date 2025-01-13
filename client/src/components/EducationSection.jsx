import { School, X } from "lucide-react"
import { useState } from "react"
import { formatDate } from "../utils/dateUtils"

const EducationSection = ({ userData, onSave, isOwnProfile }) => {

    // states to keep track of educatoin
    const [educations, setEducations] = useState(userData.sportsEducation || [])
    const [isEditing, setIsEditing] = useState(false)
    const [newEducation, setNewEducation] = useState({
        title: "",
        institute: "",
        desc: "",
        startDate: "",
        endDate: "",
        currentlyAt: false
    })

    // add, delete education
    const handleAddEducation = () => {
        if (newEducation.title && newEducation.institute && newEducation.startDate) {
            // update the educations using spread operator
            setEducations([...educations, newEducation])

            // set new education state to empty obj
            setNewEducation({
                title: "",
                institute: "",
                desc: "",
                startDate: "",
                endDate: "",
                currentlyAt: false
            })
        }
    }

    // delete education
    const handleDeleteEducation = (id) => {
        // keep the educations that are not the given id
        setEducations(educations.filter((edu) => edu._id !== id))
    }

    const handleSave = () => {
        onSave({ sportsEducation: educations })
        setIsEditing(false)
    }

    // we have to handle Currently at educating
    const handleCurrentlyAtChange = (e) => {
        setNewEducation({
            ...newEducation,
            // if we have checked it, this becomes true else false
            currentlyAt: e.target.checked,
            endDate: e.target.checked ? "" : newEducation.endDate
        })
    }

    return (
        <div className="bg-black rounded-lg shadow p-4 mb-6">
            <h2 className="text-lg font-semibold mb-2">Education</h2>

            {/* if no educations print no educations added */}
            {educations.length === 0 && <p className="p-2 text-neutral-500">No educations added.</p>}

            {/* if its our own profile we can add achievements  */}
            {educations.map((edu) => (
                <div key={edu._id} className='m-3 flex justify-between items-start'>
                    <div className='flex items-start gap-3'>
                        <School size={20} className='mr-2 mt-1' />
                        <div>
                            <h3 className='font-semibold'>{edu.title}</h3>
                            <p className=''>{edu.sport}</p>
                            <p className='text-neutral-500'>{edu.institute}</p>
                            <p className='text-neutral-500 text-sm'>
                                {formatDate(edu.startDate)} - {edu.currentlyAt ? "Present" : formatDate(edu.endDate)}
                            </p>
                        </div>
                    </div>
                    {isEditing && (
                        <button onClick={() => handleDeleteEducation(edu._id)} className='text-red-500'>
                            <X size={20} />
                        </button>
                    )}
                </div>
            ))}

            {/* if we are editing the profile, we can add new education  */}
            {isEditing && (
                // title
                <div className="mt-4 flex flex-col gap-3">
                    <input
                        type="text"
                        value={newEducation.title}
                        placeholder="Sports Education Title"
                        onChange={(e) => setNewEducation({ ...newEducation, title: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md bg-neutral-900 text-white"
                    />

                    {/* institute */}
                    <input
                        type="text"
                        value={newEducation.institute}
                        placeholder="Institute Name"
                        onChange={(e) => setNewEducation({ ...newEducation, institute: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md bg-neutral-900 text-white"
                    />

                    {/* sport */}
                    <select
                        name="sport"
                        id="sport"
                        value={newEducation.sport}
                        onChange={(e) => setNewEducation({ ...newEducation, sport: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md bg-neutral-900 text-white"
                    >
                        <option value="Select Sport">Select Sport</option>
                        <option value="Cricket">Cricket</option>
                        <option value="Football">Football</option>
                        <option value="Hockey">Hockey</option>
                        <option value="Badminton">Badminton</option>
                        <option value="Volleyball">Volleyball</option>
                    </select>

                    {/* start date */}
                    <input
                        type="date"
                        value={newEducation.startDate}
                        onChange={(e) => setNewEducation({ ...newEducation, startDate: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md bg-neutral-900 text-white"
                    />

                    <div className="flex items-center mb-2">
                        <input
                            type="checkbox"
                            id="currentlyAt"
                            onChange={handleCurrentlyAtChange}
                            checked={newEducation.currentlyAt}
                            className="mr-2"
                        />
                        <label htmlFor="currentlyAt">I am currently taking sports Education here</label>
                    </div>

                    {/* now if the currently at is checked, the end date is not required */}
                    {!newEducation.currentlyAt && (
                        <input
                            type="date"
                            value={newEducation.endDate}
                            onChange={(e) => setNewEducation({ ...newEducation, endDate: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-md bg-neutral-900 text-white"
                        />
                    )}

                    <button onClick={handleAddEducation} className="bg-neutral-700 text-white px-4 py-2 rounded-md mt-4 hover:bg-neutral-800">
                        Save Education
                    </button>
                </div>
            )}

            {/* if its not our own profile, we can not add education  */}
            {isOwnProfile && (
                <>
                    {isEditing ? (
                        <button onClick={handleSave} className="bg-red-600 text-white px-4 py-2 rounded-md mt-4 hover:bg-red-900">
                            Save Education
                        </button>
                    ) : (
                        <button onClick={() => setIsEditing(true)} className="bg-neutral-700 text-white px-4 py-1 rounded-md mt-4 hover:bg-neutral-800">
                            Edit Education
                        </button>
                    )}
                </>
            )}

        </div>
    )
}

export default EducationSection
