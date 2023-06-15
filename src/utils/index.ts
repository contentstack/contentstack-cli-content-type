import { cliux } from '@contentstack/cli-utilities'
import config from '../config'
import { Stack } from '../types'

export async function getStack(managementSdk: any, apiKey: string, spinner: any) {
  const stackDetails = await managementSdk
    .stack({ api_key: apiKey })
    .fetch()
    .then((data: any) => data)
    .catch((error: any) => {
      handleErrorMsg(error, spinner)
    })
  return {
    api_key: apiKey,
    master_locale: stackDetails.master_locale,
    name: stackDetails.name,
    org_uid: stackDetails.org_uid,
    uid: stackDetails.uid
  } as Stack
}

export async function getUsers(managementSdk: any, apiKey: string, spinner: any) {
  return await managementSdk
    .stack({ api_key: apiKey })
    .users()
    .then((data: any) => data)
    .catch((error: any) => {
      handleErrorMsg(error, spinner)
    })
}

export async function getContentTypes(
  managementSdk: any,
  apiKey: string,
  spinner: any,
  skip = config.skip,
  contentTypes: any[] = []
): Promise<any[]> {
  const ct = await managementSdk
    .stack({ api_key: apiKey })
    .contentType()
    .query()
    .find()
    .then((data: any) => data)
    .catch((error: any) => {
      handleErrorMsg(error, spinner)
    })

  if (ct?.items?.length > 0) {
    contentTypes = [...contentTypes, ...ct.items]
    skip += config.limit
    if (skip < ct.count) return await getContentTypes(managementSdk, apiKey, spinner, skip, contentTypes)
  }
  return contentTypes
}

export async function getGlobalFields(
  managementSdk: any,
  apiKey: string,
  spinner: any,
  skip = config.skip,
  globalFields: any[] = []
): Promise<any[]> {
  const gf = await managementSdk
    .stack({ api_key: apiKey })
    .globalField()
    .query()
    .find()
    .then((data: any) => data)
    .catch((error: any) => {
      handleErrorMsg(error, spinner)
    })

  if (gf?.items?.length > 0) {
    globalFields = [...globalFields, ...gf.items]
    skip += config.limit
    if (skip < gf.count) return await getGlobalFields(managementSdk, apiKey, spinner, skip, globalFields)
  }
  return globalFields
}

export async function getContentType(params: {
  managementSdk: any;
  apiKey: string;
  uid: string;
  ctVersion?: string;
  spinner: any;
}) {
  const { managementSdk, apiKey, ctVersion, spinner, uid } = params
  const param = ctVersion ? { version: ctVersion } : {}
  return await managementSdk
    .stack({ api_key: apiKey })
    .contentType(uid)
    .fetch(param)
    .then((data: any) => data)
    .catch((error: any) => {
      handleErrorMsg(error, spinner)
    })
}

function handleErrorMsg(err: any, spinner: any) {
  cliux.loaderV2('', spinner)
  if (err?.errorMessage) {
    cliux.print(`Error: ${err.errorMessage}`, { color: 'red' })
  } else if (err?.message) {
    cliux.print(`Error: ${err.message}`, { color: 'red' })
  } else {
    cliux.print('Error: Something went wrong.Please try again!', {
      color: 'red'
    })
  }
  process.exit(1)
}
