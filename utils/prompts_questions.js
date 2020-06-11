const mm_utils = require('./menu_meta_utils');
const prompts = require('prompts');
const path = require('path');
const fs_utils = require('./fs_utils');

const setTextIfPrevIsNull = prev => prev == 'new' ? 'text' : null;

const getPromptForCategories = (menuMetaData, message, newCategoryText) => {
    return { 
        type: 'autocomplete', 
        name: 'name',
        message: message, 
        choices: mm_utils.getCategories(menuMetaData, newCategoryText) 
    }
}

const getCategoryQuestions = (menuMetaData) => {
    return [
        getPromptForCategories(menuMetaData, 'Select a category to which you wish to add a new demo. Select `New category` to add a new category.', '[New category]'),
    { 
        type: setTextIfPrevIsNull,
        name: 'newName',
        message: 'Type name for a new category'
    }];
}

const getGroupQuestions = (menuMetaData, category) => {
    return [{ 
        type: 'autocomplete', 
        name: 'name', 
        message: 'Select a group to which you wish to add a new demo. Select `New group` to add a new group.', 
        choices: mm_utils.getGroups(menuMetaData, category.name, '[New group]') 
    }, {
        type: setTextIfPrevIsNull,
        name: 'newName',
        message: 'Type name for a new group'
    }];
}

const getDemoQuestions = (menuMetaData, category, group) => {
    return [{ 
        type: 'autocomplete', 
        name: 'name', 
        message: 'Select an existng demo to add missing approaches or `[New demo]` to add a new demo to this group.', 
        choices: mm_utils.getDemos(menuMetaData, category.name, group.name, '[New demo]') 
    }, {
        type: setTextIfPrevIsNull,
        name: 'newName',
        message: 'Type name for a new demo',
    }];
}

const onCancel = () => {
    console.log('Bye-bye!');
    process.exit(0);
}

const getWidgetQuestions = (baseDemosDir) => {
    return [{
        type: 'autocomplete',
        name: 'name',
        message: 'Select directory to which place the demo. Select `[New directory]` to create a new directory',
        choices: fs_utils.getWidgets(path.join(baseDemosDir), '[New directory]')
    }, {
        type: (prev, answers) => answers.name == 'new' ? 'text' : null,
        name: 'newName',
        format: val => val.replace(/(?:^|\s)\S/g, (a) => a.toUpperCase()).replace(/ /g, ""),
        message: 'Type name for a new directory',
    }];
}

const getApproachesQuestions = (approaches) => {
    return {
        type: 'multiselect',
        name: 'selectedApproaches',
        message: 'Select approaches to add',
        choices: () => approaches.map((item) => { return { title: item, value: item }; })
    }
}

const getNewOrExistingQuestions = (menuMetaData) => {
    return [{
        type: 'autocomplete',
        name: 'choice',
        message: 'Would you like to create a blank demo or copy files from existing demo?',
        choices: [{ title: 'Create a new demo', value: 'new' }, { title: 'Copy files from existing demo', value: 'existing' }]
    },{
        type: (prev, answers) => answers.choice == 'existing' ? 'autocomplete' : null,
        name: 'category',
        message: 'Copy from existing: Select a category',
        choices: mm_utils.getCategories(menuMetaData)
    }, {
        type: (prev, answers) => answers.choice == 'existing' ? 'autocomplete' : null,
        name: 'group',
        message: 'Copy from existing: Select a group',
        choices: (prev, answers) => mm_utils.getGroups(menuMetaData, answers.category)
    }, {
        type: (prev, answers) => answers.choice == 'existing' ? 'autocomplete' : null,
        name: 'demo',
        message: 'Copy from existing: Select a demo',
        choices: (prev, answers) => mm_utils.getDemos(menuMetaData, answers.category, answers.group)
    }]
}

const getApproachesFoldersQuestions = (approaches) => {
    let result = approaches.map(function(approach) {
        return { title: approach };
    });
    return {
        type: "autocomplete",
        name: 'approach',
        message: 'Select approach',
        choices: result
    };
}

const getDemoToUpdateQuestions = (menuMetaData) => {
    return [{
        type: "autocomplete",
        name: 'category',
        message: 'Select a category',
        choices: mm_utils.getCategories(menuMetaData)
    }, {
        type: "autocomplete",
        name: 'group',
        message: 'Select a group',
        choices: (prev, answers) => mm_utils.getGroups(menuMetaData, answers.category)
    }, {
        type: "autocomplete",
        name: 'demo',
        message: 'Select a demo',
        choices: (prev, answers) => mm_utils.getDemos(menuMetaData, answers.category, answers.group)
    }]
}

const askCategory = async (menuMetaData) => {
    return prompts(getCategoryQuestions(menuMetaData), { onCancel });
}
const askGroup = async (menuMetaData, category) => {
    return prompts(getGroupQuestions(menuMetaData, category), { onCancel });
}

const askDemo = async (menuMetaData, category, group) => {
    return prompts(getDemoQuestions(menuMetaData, category, group), { onCancel });
}

const askWidget = async (baseDemosDir) => {
    return prompts(getWidgetQuestions(baseDemosDir), { onCancel });
}

const askApproaches = async (missingApproaches) => {
    return prompts(getApproachesQuestions(missingApproaches), { onCancel });
}

const askNewOrExisting = async (menuMetaData) => {
    return prompts(getNewOrExistingQuestions(menuMetaData), { onCancel });
}

const askDemoToUpdate = async (menuMetaData) => {
    return prompts(getDemoToUpdateQuestions(menuMetaData), { onCancel });
}

const askApproachesFolder = async (approaches) => {
    return prompts(getApproachesFoldersQuestions(approaches), { onCancel });
}

const askHGPath = async () => {
    return prompts({
        type: 'text',
        name: 'hgPath',
        message: 'Specify a path of the Tortoise HG repository:'
    }, { onCancel });
}


module.exports = {
    getCategoryQuestions,
    getGroupQuestions,
    askGroup,
    askNewOrExisting,
    askApproachesFolder,
    askCategory,
    askDemo,
    askDemoToUpdate,
    askApproaches,
    askWidget,
    askHGPath,
    getDemoQuestions,
    getApproachesQuestions,
    getWidgetQuestions,
    getApproachesFoldersQuestions,
    getDemoToUpdateQuestions,
    getNewOrExistingQuestions,
}