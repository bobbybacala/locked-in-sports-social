import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import { axiosInstance } from "../libs/axios"
import toast from "react-hot-toast"
import ProfileHeader from "../components/ProfileHeader"
import AboutSection from "../components/AboutSection"
import AchievementsSection from "../components/AchievementsSection"
import EducationSection from "../components/EducationSection"
import ExperienceSection from "../components/ExperienceSection"
import SkillsSection from "../components/SkillsSection"
// import SocialLinksSection from "../components/SocialLinksSection"

const ProfilePage = () => {
    // get the username from the params
    const { username } = useParams()

    // query client to update the profile page
    const queryClient = useQueryClient()

    // get the authUser
    const { data: authUser, isLoading } = useQuery({
        queryKey: ['authUser']
    })

    // get the profile of the user we want to see
    const { data: userProfile, isLoading: isUserProfileLoading } = useQuery({
        queryKey: ['userProfile', username],
        // get the user data from `/api/v1/users/${username}` from the backend
        queryFn: () => axiosInstance.get(`/users/${username}`)
    })

    // mutation function if you want to update the profile, you can only update your own profile, ie authUser can only update his/her profile
    const { mutate: updateProfile } = useMutation({
        mutationFn: async (updatedData) => {
            await axiosInstance.put(`/users/profile`, updatedData)
        },
        onSuccess: () => {
            // update the profile page
            queryClient.invalidateQueries(['authUser'])
            toast.success('Profile updated successfully')
        },
        onError: (error) => {
            toast.error(error.response?.data?.error || 'Error updating profile')
        }
    })

    // return nothing if data is loading
    if (isLoading || isUserProfileLoading) {
        return null
    }

    // check if we are going thru of our own profile, based on that we can fetch data
    const isOwnProfile = authUser.username === userProfile.data.username
    const userData = isOwnProfile ? authUser : userProfile.data

    // funtion to save the data when we update the profile
    const handleSave = (updatedData) => {
        updateProfile(updatedData)
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            {/* all the sections now */}
            {/* profile header */}
            <ProfileHeader userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />

            {/* about section */}
            <AboutSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />


            <AchievementsSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />


            <ExperienceSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />


            <EducationSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />


            <SkillsSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />

        
            {/* <SocialLinksSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} /> */}
        </div>
    )
}

export default ProfilePage
