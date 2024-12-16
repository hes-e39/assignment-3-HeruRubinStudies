import commonTimerStyles from '../timers/timer-common.module.scss';
import NumberStepper from '../generic/NumberStepper/NumberStepper.tsx';
import type React from 'react';
import ConfirmationMenu from "../menus/ConfirmationMenu/ModalConfirmation.tsx";

interface CountDownEditorProps {
    goalHours: number;
    setGoalHours: (newValue: number) => void;
    goalMinutes: number;
    setGoalMinutes: (newValue: number) => void;
    goalSeconds: number;
    setGoalSeconds: (newValue: number) => void;
    applyCustomConfig: () => void;
    toggleModal: () => void;
    showMenu: boolean;

    // props for hand description
    description?: string;
    setDescription: (newValue: string) => void;
    overrideDescription? : string;
}

const CountdownEditor: React.FC<CountDownEditorProps> = ({
                                                             goalHours,
                                                             setGoalHours,
                                                             setGoalMinutes,
                                                             goalMinutes,
                                                             setGoalSeconds,
                                                             goalSeconds,
                                                             toggleModal,
                                                             applyCustomConfig,
                                                             showMenu,
                                                             setDescription,
                                                             description
                                                         }) => {
    return (
        <>
            <div className={commonTimerStyles.inputsArea}>
                <div className={commonTimerStyles.steppersArea}>
                    <NumberStepper label="Hours" value={goalHours} onChange={setGoalHours} min={0} max={100} step={1} />
                    <NumberStepper label="Minutes" value={goalMinutes} onChange={setGoalMinutes} min={0} max={59} step={1} />
                    <NumberStepper label="Seconds" value={goalSeconds} onChange={setGoalSeconds} min={0} max={59} step={1} />
                </div>
                <div className={commonTimerStyles.inputRow}>
                    <label htmlFor="descriptionInput">Description:</label>
                    <input
                        id="descriptionInput"
                        type="text"
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder={ description ?? "Describe this timer..." }
                    />
                </div>
            </div>
            {showMenu && (
                <ConfirmationMenu
                    cancelLabel="Cancel"
                    applyLabel="Apply"
                    apply={applyCustomConfig}
                    cancel={toggleModal}
                />
            )}
        </>
    );
};

export default CountdownEditor;
