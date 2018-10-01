// @flow
import React from 'react';
import type { Request } from "../QuestrarTypes";

export const REQUEST_ACTION_TYPE = '__QUESTRAR_REQUEST_ACTION';


//status flags
export const PENDING = 'pending';
export const SUCCESS = 'success';
export const FAILED = 'failed';

//pseudo flags
export const REPLACE = 'replace';


//Initial request provision
export const initialRequest: Request = {
  pending: false,
  success: false,
  failed: false,
  successCount: 0,
  failureCount: 0,
  message: ''
};
