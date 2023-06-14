import { makeAutoObservable, runInAction } from "mobx";
import { Activity } from "../models/activity";
import agent from "../API/agent";

import {v4 as uuid} from 'uuid';

export default class ActivityStore {
    activityRegistry = new Map<string, Activity>();
    selectedActivity : Activity | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = false;

    constructor() {
        makeAutoObservable(this);   
    }

    get activitiesByDate() {
        return Array.from(this.activityRegistry.values()).sort((a,b) => Date.parse(a.date) - Date.parse(b.date));
    }

    get groupedActivities() {
        return Object.entries(this.activitiesByDate.reduce((activities, activity) => {
            const date = activity.date;
            activities[date] = activities[date] ? [...activities[date], activity] : [activity];
            return activities;
            }, {} as {[key: string]: Activity[]})
        );
    }

    get groupedActivities2() {
        const dict = new Map<string, Activity[]>();

        this.activitiesByDate.forEach((activity) => {
            let arr = dict.get(activity.date);
            if(arr) {
                arr.push(activity); 
            } else {
                dict.set(activity.date, [activity]);
            }
        });
        return dict;
    }

    loadActivities = async () => {
        this.loadingInitial = true;
        try {
            const activities = await agent.Activities.list();
            runInAction(() => {
                activities.forEach(a => {
                    this.setActivity(a);
                  });
    
                  this.loadingInitial = false;
            });
            
        } catch (error) {
            console.log(error);

            runInAction(() => {
                this.loadingInitial = false;
            });
        }
    }

    loadActivity = async (id: string) => {
        let activity = this.getActivity(id);

        if(activity) {
            this.selectedActivity = activity;
            return activity;
        } else {
            this.loadingInitial = true;
            try {
                activity = await agent.Activities.details(id);
                this.setActivity(activity);

                runInAction(() => {
                    this.selectedActivity = activity;
                    this.loadingInitial = false;
                });

                return activity;
            } catch (error) {
                console.log(error);

                runInAction(() => {
                    this.loadingInitial = false;
                });
            }
        }
    }

    private setActivity = (activity: Activity) => {
        activity.date = activity.date.split('T')[0];
        this.activityRegistry.set(activity.id, activity);
    }

    private getActivity = (id: string) => {
        return this.activityRegistry.get(id);
    }

    // selectActivity = (id:string) => {
    //     this.selectedActivity = this.activityRegistry.get(id);
    // }

    // cancelSelectedActivity = () => {
    //     this.selectedActivity = undefined;
    // }

    // openForm = (id?: string) => {
    //     id 
    //         ? this.selectActivity(id)
    //         : this.cancelSelectedActivity();

    //     this.editMode = true;
    // }

    // closeForm = () => {
    //     this.editMode = false;
    // }

    createActivity = async (activity: Activity) : Promise<string> => {
        this.loading = true;
        activity.id = uuid();

        try {
            await agent.Activities.create(activity);
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity);
                this.selectedActivity = activity;
                this.editMode = false;
                this.loading = false;

            });
            return activity.id;
        } catch(error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            });

            return '';
        }
    }

    updateActivity = async (activity: Activity) => {
        this.loading = true;

        try {
            await agent.Activities.update(activity);
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity);
                this.selectedActivity = activity;
                this.editMode = false;
                this.loading = false;
            });
        } catch(error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    removeActivity = async (id: string) => {
        this.loading = true;

        try {
            await agent.Activities.delete(id);

            runInAction(() => {
                this.activityRegistry.delete(id);
                this.selectedActivity = undefined;
                this.editMode = false;
                this.loading = false;
            });
        } catch(error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            });
        }
    }
}