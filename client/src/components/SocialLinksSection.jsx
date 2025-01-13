
import { useState } from "react";

const SocialLinksSection = ({ userData, isOwnProfile, onSave }) => {
    const [links, setLinks] = useState(userData.socialLinks || {});
    const [isEditing, setIsEditing] = useState(false);

    // for the link to be added
    const [newPlatform, setNewPlatform] = useState("");
    const [newUrl, setNewUrl] = useState("");

    const handleInputChange = (platform, value) => {
        setLinks((prevLinks) => ({
            ...prevLinks,
            [platform]: value,
        }));
    };

    const handleAddLink = () => {
        if (!newPlatform || !newUrl) return;
        setLinks((prevLinks) => ({
            ...prevLinks,
            [newPlatform]: newUrl,
        }));
        console.log(links);
        setNewPlatform("");
        setNewUrl("");
    };

    const handleDeleteLink = (platform) => {
        setLinks((prevLinks) => {
            const updatedLinks = { ...prevLinks };
            delete updatedLinks[platform];
            return updatedLinks;
        });
    };

    const handleSave = () => {
        onSave({socialLinks: links}); // Save updated links
        console.log(userData.socialLinks);
        setIsEditing(false); // Exit editing mode
    };

    return (
        <div className="p-4 bg-black rounded-md shadow-md">
            <h2 className="text-lg font-semibold text-white mb-2">Social Links</h2>
            {Object.keys(links).length === 0 && !isEditing && (
                <p className="text-neutral-500 p-2">No social links added.</p>
            )}

            <div className="space-y-4 p-3">
                {Object.entries(links).map(([platform, url]) => (
                    <div key={platform} className="flex items-center space-x-4">
                        <span className="capitalize text-neutral-200 font-medium">
                            {platform}:
                        </span>
                        {isEditing ? (
                            <>
                                <input
                                    type="url"
                                    value={url}
                                    onChange={(e) => handleInputChange(platform, e.target.value)}
                                    className="flex-1 bg-neutral-900 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-neutral-500"
                                    placeholder={`Enter ${platform} URL`}
                                />
                                <button
                                    onClick={() => handleDeleteLink(platform)}
                                    className="bg-neutral-900  p-2 rounded text-red-500 hover:text-red-700 transition"
                                >
                                    Delete
                                </button>
                            </>
                        ) : (
                            <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-neutral-400 hover:text-neutral-500 transition"
                            >
                                {url}
                            </a>
                        )}
                    </div>
                ))}
            </div>

            {isEditing && (
                <>
                    <div className="mt-6 flex items-center space-x-4">
                        <select
                            value={newPlatform}
                            onChange={(e) => setNewPlatform(e.target.value)}
                            className="bg-neutral-900 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-neutral-500"
                        >
                            <option value="">Select Platform</option>
                            <option value="instagram">Instagram</option>
                            <option value="linkedin">LinkedIn</option>
                            <option value="twitter">Twitter</option>
                        </select>
                        <input
                            type="url"
                            value={newUrl}
                            onChange={(e) => setNewUrl(e.target.value)}
                            placeholder="Enter URL"
                            className="flex-1 bg-neutral-900 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-neutral-500"
                        />
                        <button
                            onClick={handleAddLink}
                            className="bg-neutral-800 text-white px-4 py-2 rounded hover:bg-neutral-900 transition"
                        >
                            Add
                        </button>
                    </div>

                    <div className="mt-6 flex space-x-4">
                        <button
                            onClick={handleSave}
                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-900 transition"
                        >
                            Save
                        </button>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="bg-neutral-800 text-white px-4 py-2 rounded hover:bg-neutral-900 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </>
            )}

            {!isEditing && isOwnProfile && (
                <button
                    onClick={() => setIsEditing(true)}
                    className="mt-6 bg-neutral-700 text-white px-4 py-1 rounded hover:bg-neutral-800 transition"
                >
                    Edit Links
                </button>
            )}
        </div>
    );
};

export default SocialLinksSection;
