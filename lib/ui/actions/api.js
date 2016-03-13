import {
  FETCH_CAPTURED_REQUESTS,
  FETCH_CAPTURED_REQUESTS_SUCCESS,
  FETCH_SCENARIOS,
  FETCH_SCENARIOS_SUCCESS,
  MOCK_REQUEST,
  CREATE_NEW_SCENARIO
} from 'ui/constants/action-types';

export function fetch() {
  return { type: FETCH_CAPTURED_REQUESTS };
}

export function fetchCapturedRequestsSuccess(payload) {
  return { type: FETCH_CAPTURED_REQUESTS_SUCCESS, payload };
}

export function fetchScenarios() {
  return { type: FETCH_SCENARIOS };
}

export function fetchScenariosSuccess(payload) {
  return { type: FETCH_SCENARIOS_SUCCESS, payload };
}

export function mockRequest(scenarioId, request) {
  return { type: MOCK_REQUEST, payload: { scenarioId, request} };
}

export function createNewScenario() {
  return { type: CREATE_NEW_SCENARIO };
}