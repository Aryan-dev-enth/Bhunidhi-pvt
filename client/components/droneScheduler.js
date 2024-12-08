export const droneScheduler = async (sites, drones) => {
    if (!sites || !drones) {
        return null;
    }

    const updatedDrones = drones.map((drone) => ({
        ...drone,
        surveyQueue: [...(drone.surveyQueue || [])], // Ensure surveyQueue is a mutable array
    }));

    for (let i = 0; i < sites.length; i++) {
        const droneIndex = i % updatedDrones.length;
        updatedDrones[droneIndex].surveyQueue.push(sites[i]._id);
    }

    return updatedDrones;
};
