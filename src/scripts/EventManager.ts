
interface IEvent{
    name: string;
    actions: ((arg0: any) => void)[]
}

export class EventManager {
    static listners: IEvent[] = [];


    /**
     * Adds the function to the event.
     * @param name the name of the event, unique.
     * @param action the callback to invoke.
     */
    static AddListner(name: string, action: (arg0: any) => void) {
        let index = EventManager.listners.findIndex(x => x.name === name);
        if (index === -1){
            index = EventManager.listners.push({ name: name, actions: [] });
            EventManager.listners[index - 1].actions.push(action);
            return;
        }

        EventManager.listners[index].actions.push(action);
    };
    /**
    * Removes the listner from the pool.
    * @param name the name of the event, unique.
    * @param action the callback to invoke.
    */
    static RemoveListner(name: string, action: (arg0: any) => void) {
        let index = EventManager.listners.findIndex(x => x.name === name);

        if (index === -1) return;

        EventManager.listners[index].actions = EventManager.listners[index].actions.filter(x => x !== action);

        if (EventManager.listners[index].actions.length === 0)
            EventManager.listners.splice(index, 1);
    };

    /**
     * Invokes the event, returns bool if successful or not.
     * @param name the name of the event, unique.
     * @returns bool, success.
     */
    static Invoke(name: string, value: any = null) {
        const listner = EventManager.listners.find(x => x.name === name);
        if (listner === undefined) return false;

        for (let i = 0; i < listner.actions.length; i++) {
            const element = listner.actions[i];
            element.call(undefined, value);
            return true;
        }
        return false;
    };
}
