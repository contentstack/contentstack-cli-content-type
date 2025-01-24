import moment from 'moment' 
import urlJoin from 'url-join';
const TIME_FORMAT = 'L hh:mm:ss a'

export function date(date: any) {
  return moment(date).format(TIME_FORMAT)
}

export function fullName(users: any, uid: string) {
  if (!users || users.length === 0) return 'Unknown'
  const user = users.find((u: any) => u.uid === uid)
  if (!user) return 'Unknown'
  return `${user.first_name} ${user.last_name}`
}

export function contentType(contentType: any) {
  if (!contentType || !contentType.options) return 'Unknown'

  if (contentType.options.is_page) {
    return 'Page'
  }
  return 'Content Block'
}

export function allowMultiple(contentType: any) {
  if (!contentType || !contentType.options) return 'Unknown'
  return contentType.options.singleton ? 'False' : 'True'
}

export function urlPattern(contentType: any) {
  if (!contentType || !contentType.options) return 'Unknown'
  if (!contentType.options.url_pattern) return 'N/A'

  return urlJoin(contentType.options.url_prefix, contentType.options.url_pattern)
}

export function checked(value: boolean) {
  if (value) return '*'
}
