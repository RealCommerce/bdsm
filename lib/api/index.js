import Emitter from 'api/emitter';
import 'api/interceptor';
import { PersistentStorage } from 'api/storage';
import Scenarios from 'api/scenarios';
import Requests from 'api/requests';
import EVENTS from 'api/constants/events';

class PublicAPI {

  constructor() {
    this.version = __VERSION;
    this.init();
  }

  init() {
    PersistentStorage.init();
    Scenarios.init();
  }

  get capturedRequests() {
    return Requests.capturedRequests;
  }

  get mockedRequests() {
    return Scenarios.getMockedRequests();
  }

  get activeMockedRequests() {
    return Scenarios.getCurrentMockedRequests();
  }

  get scenarios() {
    return Scenarios.scenarios;
  }

  getAppName() {
    return PersistentStorage.getAppName();
  }

  setAppName(appName) {
    PersistentStorage.setAppName(appName);
    this.init();
    return this; // Allow chaining
  }

  import(data = '{}') {
    const dataTree = JSON.parse(data);
    Scenarios.mergeScenarios(dataTree.scenarios);
    PersistentStorage.persist();
    Emitter.emit(EVENTS.IMPORT);
  }

  export() {
    const scenarios = Scenarios.scenarios.map((scenario) => scenario.export());

    const exportObject = {
      "version": PersistentStorage.getVersion(),
      "scenarios": scenarios
    };

    return JSON.stringify(exportObject);
  }

  exportMock(scenarioId, mockId) {
    const scenario = Scenarios.getById(scenarioId).exportMock(mockId);

    const exportObject = {
      "version": PersistentStorage.getVersion(),
      "scenarios": [scenario]
    };

    return JSON.stringify(exportObject);
  }

  exportScenario(scenarioId) {
    const scenario = Scenarios.getById(scenarioId).export();

    const exportObject = {
      "version": PersistentStorage.getVersion(),
      "scenarios": [scenario]
    };

    return JSON.stringify(exportObject);
  }

  addScenario(name) {
    Scenarios.addScenario(name);
    Emitter.emit(EVENTS.SCENARIO_ADD);
    Emitter.emit(EVENTS.SCENARIO_CHANGE);
  }

  toggleScenario(id) {
    Scenarios.toggle(id);
    Emitter.emit(EVENTS.SCENARIO_CHANGE);
  }

  renameScenario(scenarioId, newName) {
    Scenarios.renameScenario(scenarioId, newName);
    Emitter.emit(EVENTS.SCENARIO_RENAME);
    Emitter.emit(EVENTS.SCENARIO_CHANGE);
  }

  removeScenario(scenarioId) {
    Scenarios.removeScenario(scenarioId);
    Emitter.emit(EVENTS.SCENARIO_REMOVE);
    Emitter.emit(EVENTS.SCENARIO_CHANGE);
  }

  duplicateScenario(scenarioId) {
    Scenarios.duplicateScenario(scenarioId);
    Emitter.emit(EVENTS.SCENARIO_DUPLICATE);
    Emitter.emit(EVENTS.SCENARIO_CHANGE);
  }

  mockRequest(scenarioId, request) {
    Scenarios.mockRequest(scenarioId, request);
    Emitter.emit(EVENTS.MOCKED_REQUESTS_ADD);
  }

  updateMockedRequest(scenarioId, mockRequestId, request) {
    Scenarios.updateMockRequest(scenarioId, mockRequestId, request);
    Emitter.emit(EVENTS.SCENARIO_CHANGE);
  }

  removeMockedRequest(scenarioId, mockedRequestId) {
    Scenarios.removeMockedRequest(scenarioId, mockedRequestId);

    this.capturedRequests
      .filter((request) => (request.mock || {}).id === mockedRequestId)
      .forEach((request) => request.removeMock());

    Emitter.emit(EVENTS.SCENARIO_CHANGE);
  }

  toggleMockedRequest(scenarioId, mockedRequestId) {
    Scenarios.toggleMockedRequest(scenarioId, mockedRequestId);
    Emitter.emit(EVENTS.SCENARIO_CHANGE);
  }

  clearStorage() {
    PersistentStorage.clear();
    Emitter.emit(EVENTS.SCENARIO_CHANGE);
  }

  on(event, callback, context) {
    Emitter.on(event, callback, context);
  }

  once(event, callback, context) {
    Emitter.once(event, callback, context);
  }

  off(event, callback, context) {
    Emitter.removeListener(event, callback, context);
  }

}

export const API = new PublicAPI();
