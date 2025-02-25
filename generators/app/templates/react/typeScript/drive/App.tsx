import React, { useCallback, useMemo, useState } from "react";
import "@geotab/zenith/dist/index.css";
import "../../styles/app.css";
import {
    Button,
    FooterButtons,
    Header,
    IconQuestion,
    Menu,
    Modal,
    Tabs,
} from "@geotab/zenith";
import { Tab1Content } from "./Tab1Content";
import { Tab2Content } from "./Tab2Content";

const App: React.FC = () => {
    const [isHelpVisible, setHelpVisible] = useState(false);
    const [activeTab, setActiveTab] = useState("tab1");
    const tabs = useMemo(() => [{
        id: "tab1",
        name: "Tab 1"
    }, {
        id: "tab2",
        name: "Tab 2"
    }], []);

    const content = useMemo(() => ({
        "tab1": <Tab1Content />,
        "tab2": <Tab2Content />
    }), []);

    const contactSupport = useCallback(() => {
        console.log("Contact support");
        setHelpVisible(false);
    }, []);

    return <div className="zda-app">
        <Header className="zda-app__header">
            <Header.Title pageName="Add-in title" />
            <Header.Button id="about" type="tertiary" icon={IconQuestion} onClick={() => setHelpVisible(true)}></Header.Button>
            <Header.Menu id="submenu" type="tertiary" name="More">
                <Menu.Item id="settings" name="Settings" onClick={() => { console.log("Settings"); }} />
                <Menu.Item id="action1" name="Action 1" onClick={() => { console.log("Action 1"); }} />
                <Menu.Item id="action2" name="Action 2" onClick={() => { console.log("Action 2"); }} />
                <Menu.Item id="action3" name="Action 3" onClick={() => { console.log("Action 3"); }} />
            </Header.Menu>
            <Tabs key="headerTabs" tabs={tabs} activeTabId={activeTab} onTabChange={setActiveTab} />
        </Header>

        <div className="zda-app__content">
           { content[activeTab as ("tab1" | "tab2")] || null }
        </div>
        <FooterButtons isSticky={true}>
            <Button type="primary">Main action</Button>
        </FooterButtons>

        { isHelpVisible
            ? <Modal type="info" isOpen={true} onClose={() => setHelpVisible(false)} title="About this add-in">
                    Lorem ipsum dolor sit amet consectetur. Quis consectetur suspendisse nullam magn eget eu facilisi. Mollis eleifend et et commodo consectetur lorem sit et.
                    <Modal.TertiaryButton onClick={ contactSupport }>Contact support</Modal.TertiaryButton>
                </Modal>
            : null }
    </div>
};

export default App;
