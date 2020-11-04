"use strict";
/*
 * Copyright (C) 2016 - present Juergen Zimmermann, Hochschule Karlsruhe
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrap = exports.notYetImplemented = exports.internalError = exports.notFound = exports.validateUUID = exports.validateContentType = exports.logRequestHeader = void 0;
const tslib_1 = require("tslib");
const httpStatus_1 = require("./httpStatus");
const json5_1 = tslib_1.__importDefault(require("json5"));
const logger_1 = require("./logger");
const validator_1 = tslib_1.__importDefault(require("validator"));
class SharedRequestHandler {
    logRequestHeader(req, _, next) {
        logger_1.logger.debug(`Request: headers=${json5_1.default.stringify(req.headers, undefined, SharedRequestHandler.SPACE)}`);
        logger_1.logger.debug(`Request: protocol=${json5_1.default.stringify(req.protocol, undefined, SharedRequestHandler.SPACE)}`);
        logger_1.logger.debug(`Request: hostname=${json5_1.default.stringify(req.hostname, undefined, SharedRequestHandler.SPACE)}`);
        logger_1.logger.debug(`Request: body=${json5_1.default.stringify(req.body, undefined, SharedRequestHandler.SPACE)}`);
        // Alle Keys vom Request Header
        Object.keys(req).forEach((key) => {
            if (Object.prototype.hasOwnProperty.call(req, key)) {
                logger_1.logger.log('silly', `Request-Key: ${key}`);
            }
        });
        // Request-Verarbeitung fortsetzen
        next();
    }
    // Der Typ "unknown" repraesentiert irgendeinen Wert genauso wie "any",
    // aber auf dem Wert kann man keine Funktionen aufrufen und auch auf keine
    // Properties zugreifen, d.h. es muss vorher ein Typecast durchgefuehrt werden
    // eslint-disable-next-line max-params
    validateUUID(_, res, next, id) {
        if (typeof id !== 'string') {
            res.status(httpStatus_1.HttpStatus.BAD_REQUEST).send('Keine gueltige Buch-ID');
        }
        const idStr = id;
        if (validator_1.default.isUUID(idStr)) {
            logger_1.logger.debug('SharedRequestHandler.validateUUID(): isUUID');
            next();
            return;
        }
        logger_1.logger.debug('SharedRequestHandler.validateUUID(): status=BAD_REQUEST');
        res.status(httpStatus_1.HttpStatus.BAD_REQUEST).send(`${idStr} ist keine gueltige Buch-ID`);
    }
    validateContentType(req, res, next) {
        const contentType = req.header('Content-Type');
        if (contentType === undefined || validator_1.default.isMimeType(contentType)) {
            logger_1.logger.debug('SharedRequestHandler.validateContentType(): ok');
            next();
            return;
        }
        logger_1.logger.debug('SharedRequestHandler.validateContentType(): status=BAD_REQUEST');
        res.status(httpStatus_1.HttpStatus.BAD_REQUEST).send(`${contentType} ist kein gueltiger MIME-Typ`);
    }
    notFound(_, res) {
        res.sendStatus(httpStatus_1.HttpStatus.NOT_FOUND);
    }
    internalError(err, _, res) {
        logger_1.logger.error(`SharedRequestHandler.internalError(): error=${json5_1.default.stringify(err)}`);
        res.sendStatus(httpStatus_1.HttpStatus.INTERNAL_ERROR);
    }
    notYetImplemented(_, res) {
        logger_1.logger.error('SharedRequestHandler.notYetImplemented()');
        res.sendStatus(httpStatus_1.HttpStatus.NOT_YET_IMPLEMENTED);
    }
}
SharedRequestHandler.SPACE = 2;
const handler = new SharedRequestHandler();
// -----------------------------------------------------------------------
// E x p o r t i e r t e   F u n c t i o n s
// -----------------------------------------------------------------------
const logRequestHeader = (req, res, next) => handler.logRequestHeader(req, res, next);
exports.logRequestHeader = logRequestHeader;
const validateContentType = (req, res, next) => handler.validateContentType(req, res, next);
exports.validateContentType = validateContentType;
// Der Typ "unknown" repraesentiert irgendeinen Wert genauso wie "any",
// aber auf dem Wert kann man keine Funktionen aufrufen und auch auf keine
// Properties zugreifen, d.h. es muss vorher ein Typecast durchgefuehrt werden
const validateUUID = (req, res, next, id) => handler.validateUUID(req, res, next, id); // eslint-disable-line max-params
exports.validateUUID = validateUUID;
const notFound = (req, res) => handler.notFound(req, res);
exports.notFound = notFound;
const internalError = (err, req, res) => handler.internalError(err, req, res);
exports.internalError = internalError;
const notYetImplemented = (req, res) => handler.notYetImplemented(req, res);
exports.notYetImplemented = notYetImplemented;
// https://github.com/expressjs/express/issues/2259
// https://github.com/expressjs/express/pull/2431
// https://strongloop.com/strongblog/async-error-handling-expressjs-es7-promises-generators
const wrap = (fn) => (...args) => fn(...args).catch(args[2]); // eslint-disable-line @typescript-eslint/no-unsafe-return
exports.wrap = wrap;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVxdWVzdC1oYW5kbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NoYXJlZC9yZXF1ZXN0LWhhbmRsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRzs7OztBQUdILDZDQUEwQztBQUMxQywwREFBMEI7QUFDMUIscUNBQWtDO0FBQ2xDLGtFQUFrQztBQUVsQyxNQUFNLG9CQUFvQjtJQUd0QixnQkFBZ0IsQ0FBQyxHQUFZLEVBQUUsQ0FBVyxFQUFFLElBQWtCO1FBQzFELGVBQU0sQ0FBQyxLQUFLLENBQ1Isb0JBQW9CLGVBQUssQ0FBQyxTQUFTLENBQy9CLEdBQUcsQ0FBQyxPQUFPLEVBQ1gsU0FBUyxFQUNULG9CQUFvQixDQUFDLEtBQUssQ0FDN0IsRUFBRSxDQUNOLENBQUM7UUFDRixlQUFNLENBQUMsS0FBSyxDQUNSLHFCQUFxQixlQUFLLENBQUMsU0FBUyxDQUNoQyxHQUFHLENBQUMsUUFBUSxFQUNaLFNBQVMsRUFDVCxvQkFBb0IsQ0FBQyxLQUFLLENBQzdCLEVBQUUsQ0FDTixDQUFDO1FBQ0YsZUFBTSxDQUFDLEtBQUssQ0FDUixxQkFBcUIsZUFBSyxDQUFDLFNBQVMsQ0FDaEMsR0FBRyxDQUFDLFFBQVEsRUFDWixTQUFTLEVBQ1Qsb0JBQW9CLENBQUMsS0FBSyxDQUM3QixFQUFFLENBQ04sQ0FBQztRQUNGLGVBQU0sQ0FBQyxLQUFLLENBQ1IsaUJBQWlCLGVBQUssQ0FBQyxTQUFTLENBQzVCLEdBQUcsQ0FBQyxJQUFJLEVBQ1IsU0FBUyxFQUNULG9CQUFvQixDQUFDLEtBQUssQ0FDN0IsRUFBRSxDQUNOLENBQUM7UUFFRiwrQkFBK0I7UUFDL0IsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtZQUM3QixJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQUU7Z0JBQ2hELGVBQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLGdCQUFnQixHQUFHLEVBQUUsQ0FBQyxDQUFDO2FBQzlDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxrQ0FBa0M7UUFDbEMsSUFBSSxFQUFFLENBQUM7SUFDWCxDQUFDO0lBRUQsdUVBQXVFO0lBQ3ZFLDBFQUEwRTtJQUMxRSw4RUFBOEU7SUFDOUUsc0NBQXNDO0lBQ3RDLFlBQVksQ0FBQyxDQUFVLEVBQUUsR0FBYSxFQUFFLElBQWtCLEVBQUUsRUFBVztRQUNuRSxJQUFJLE9BQU8sRUFBRSxLQUFLLFFBQVEsRUFBRTtZQUN4QixHQUFHLENBQUMsTUFBTSxDQUFDLHVCQUFVLENBQUMsV0FBVyxDQUFDLENBQUMsSUFBSSxDQUFDLHdCQUF3QixDQUFDLENBQUM7U0FDckU7UUFDRCxNQUFNLEtBQUssR0FBRyxFQUFZLENBQUM7UUFDM0IsSUFBSSxtQkFBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUN6QixlQUFNLENBQUMsS0FBSyxDQUFDLDZDQUE2QyxDQUFDLENBQUM7WUFDNUQsSUFBSSxFQUFFLENBQUM7WUFDUCxPQUFPO1NBQ1Y7UUFFRCxlQUFNLENBQUMsS0FBSyxDQUFDLHlEQUF5RCxDQUFDLENBQUM7UUFDeEUsR0FBRyxDQUFDLE1BQU0sQ0FBQyx1QkFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDLElBQUksQ0FDbkMsR0FBRyxLQUFLLDZCQUE2QixDQUN4QyxDQUFDO0lBQ04sQ0FBQztJQUVELG1CQUFtQixDQUFDLEdBQVksRUFBRSxHQUFhLEVBQUUsSUFBa0I7UUFDL0QsTUFBTSxXQUFXLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUMvQyxJQUFJLFdBQVcsS0FBSyxTQUFTLElBQUksbUJBQVMsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLEVBQUU7WUFDaEUsZUFBTSxDQUFDLEtBQUssQ0FBQyxnREFBZ0QsQ0FBQyxDQUFDO1lBQy9ELElBQUksRUFBRSxDQUFDO1lBQ1AsT0FBTztTQUNWO1FBRUQsZUFBTSxDQUFDLEtBQUssQ0FDUixnRUFBZ0UsQ0FDbkUsQ0FBQztRQUNGLEdBQUcsQ0FBQyxNQUFNLENBQUMsdUJBQVUsQ0FBQyxXQUFXLENBQUMsQ0FBQyxJQUFJLENBQ25DLEdBQUcsV0FBVyw4QkFBOEIsQ0FDL0MsQ0FBQztJQUNOLENBQUM7SUFFRCxRQUFRLENBQUMsQ0FBVSxFQUFFLEdBQWE7UUFDOUIsR0FBRyxDQUFDLFVBQVUsQ0FBQyx1QkFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3pDLENBQUM7SUFFRCxhQUFhLENBQUMsR0FBWSxFQUFFLENBQVUsRUFBRSxHQUFhO1FBQ2pELGVBQU0sQ0FBQyxLQUFLLENBQ1IsK0NBQStDLGVBQUssQ0FBQyxTQUFTLENBQzFELEdBQUcsQ0FDTixFQUFFLENBQ04sQ0FBQztRQUNGLEdBQUcsQ0FBQyxVQUFVLENBQUMsdUJBQVUsQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBRUQsaUJBQWlCLENBQUMsQ0FBVSxFQUFFLEdBQWE7UUFDdkMsZUFBTSxDQUFDLEtBQUssQ0FBQywwQ0FBMEMsQ0FBQyxDQUFDO1FBQ3pELEdBQUcsQ0FBQyxVQUFVLENBQUMsdUJBQVUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0lBQ25ELENBQUM7O0FBaEd1QiwwQkFBSyxHQUFHLENBQUMsQ0FBQztBQWtHdEMsTUFBTSxPQUFPLEdBQUcsSUFBSSxvQkFBb0IsRUFBRSxDQUFDO0FBRTNDLDBFQUEwRTtBQUMxRSw0Q0FBNEM7QUFDNUMsMEVBQTBFO0FBQ25FLE1BQU0sZ0JBQWdCLEdBQUcsQ0FDNUIsR0FBWSxFQUNaLEdBQWEsRUFDYixJQUFrQixFQUNwQixFQUFFLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFKakMsUUFBQSxnQkFBZ0Isb0JBSWlCO0FBRXZDLE1BQU0sbUJBQW1CLEdBQUcsQ0FDL0IsR0FBWSxFQUNaLEdBQWEsRUFDYixJQUFrQixFQUNwQixFQUFFLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFKcEMsUUFBQSxtQkFBbUIsdUJBSWlCO0FBRWpELHVFQUF1RTtBQUN2RSwwRUFBMEU7QUFDMUUsOEVBQThFO0FBQ3ZFLE1BQU0sWUFBWSxHQUFHLENBQ3hCLEdBQVksRUFDWixHQUFhLEVBQ2IsSUFBa0IsRUFDbEIsRUFBVyxFQUNiLEVBQUUsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsaUNBQWlDO0FBTG5FLFFBQUEsWUFBWSxnQkFLcUI7QUFFdkMsTUFBTSxRQUFRLEdBQUcsQ0FBQyxHQUFZLEVBQUUsR0FBYSxFQUFFLEVBQUUsQ0FDcEQsT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFEbEIsUUFBQSxRQUFRLFlBQ1U7QUFFeEIsTUFBTSxhQUFhLEdBQUcsQ0FBQyxHQUFZLEVBQUUsR0FBWSxFQUFFLEdBQWEsRUFBRSxFQUFFLENBQ3ZFLE9BQU8sQ0FBQyxhQUFhLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUQ1QixRQUFBLGFBQWEsaUJBQ2U7QUFFbEMsTUFBTSxpQkFBaUIsR0FBRyxDQUFDLEdBQVksRUFBRSxHQUFhLEVBQUUsRUFBRSxDQUM3RCxPQUFPLENBQUMsaUJBQWlCLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBRDNCLFFBQUEsaUJBQWlCLHFCQUNVO0FBRXhDLG1EQUFtRDtBQUNuRCxpREFBaUQ7QUFDakQsMkZBQTJGO0FBQ3BGLE1BQU0sSUFBSSxHQUFHLENBQUMsRUFBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBVyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQywwREFBMEQ7QUFBOUgsUUFBQSxJQUFJLFFBQStEIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoQykgMjAxNiAtIHByZXNlbnQgSnVlcmdlbiBaaW1tZXJtYW5uLCBIb2Noc2NodWxlIEthcmxzcnVoZVxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gKiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuICogdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiAqIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gKiBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICogR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKi9cblxuaW1wb3J0IHR5cGUgeyBOZXh0RnVuY3Rpb24sIFJlcXVlc3QsIFJlc3BvbnNlIH0gZnJvbSAnZXhwcmVzcyc7XG5pbXBvcnQgeyBIdHRwU3RhdHVzIH0gZnJvbSAnLi9odHRwU3RhdHVzJztcbmltcG9ydCBKU09ONSBmcm9tICdqc29uNSc7XG5pbXBvcnQgeyBsb2dnZXIgfSBmcm9tICcuL2xvZ2dlcic7XG5pbXBvcnQgdmFsaWRhdG9yIGZyb20gJ3ZhbGlkYXRvcic7XG5cbmNsYXNzIFNoYXJlZFJlcXVlc3RIYW5kbGVyIHtcbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBTUEFDRSA9IDI7XG5cbiAgICBsb2dSZXF1ZXN0SGVhZGVyKHJlcTogUmVxdWVzdCwgXzogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikge1xuICAgICAgICBsb2dnZXIuZGVidWcoXG4gICAgICAgICAgICBgUmVxdWVzdDogaGVhZGVycz0ke0pTT041LnN0cmluZ2lmeShcbiAgICAgICAgICAgICAgICByZXEuaGVhZGVycyxcbiAgICAgICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgU2hhcmVkUmVxdWVzdEhhbmRsZXIuU1BBQ0UsXG4gICAgICAgICAgICApfWAsXG4gICAgICAgICk7XG4gICAgICAgIGxvZ2dlci5kZWJ1ZyhcbiAgICAgICAgICAgIGBSZXF1ZXN0OiBwcm90b2NvbD0ke0pTT041LnN0cmluZ2lmeShcbiAgICAgICAgICAgICAgICByZXEucHJvdG9jb2wsXG4gICAgICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIFNoYXJlZFJlcXVlc3RIYW5kbGVyLlNQQUNFLFxuICAgICAgICAgICAgKX1gLFxuICAgICAgICApO1xuICAgICAgICBsb2dnZXIuZGVidWcoXG4gICAgICAgICAgICBgUmVxdWVzdDogaG9zdG5hbWU9JHtKU09ONS5zdHJpbmdpZnkoXG4gICAgICAgICAgICAgICAgcmVxLmhvc3RuYW1lLFxuICAgICAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBTaGFyZWRSZXF1ZXN0SGFuZGxlci5TUEFDRSxcbiAgICAgICAgICAgICl9YCxcbiAgICAgICAgKTtcbiAgICAgICAgbG9nZ2VyLmRlYnVnKFxuICAgICAgICAgICAgYFJlcXVlc3Q6IGJvZHk9JHtKU09ONS5zdHJpbmdpZnkoXG4gICAgICAgICAgICAgICAgcmVxLmJvZHksXG4gICAgICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIFNoYXJlZFJlcXVlc3RIYW5kbGVyLlNQQUNFLFxuICAgICAgICAgICAgKX1gLFxuICAgICAgICApO1xuXG4gICAgICAgIC8vIEFsbGUgS2V5cyB2b20gUmVxdWVzdCBIZWFkZXJcbiAgICAgICAgT2JqZWN0LmtleXMocmVxKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocmVxLCBrZXkpKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmxvZygnc2lsbHknLCBgUmVxdWVzdC1LZXk6ICR7a2V5fWApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBSZXF1ZXN0LVZlcmFyYmVpdHVuZyBmb3J0c2V0emVuXG4gICAgICAgIG5leHQoKTtcbiAgICB9XG5cbiAgICAvLyBEZXIgVHlwIFwidW5rbm93blwiIHJlcHJhZXNlbnRpZXJ0IGlyZ2VuZGVpbmVuIFdlcnQgZ2VuYXVzbyB3aWUgXCJhbnlcIixcbiAgICAvLyBhYmVyIGF1ZiBkZW0gV2VydCBrYW5uIG1hbiBrZWluZSBGdW5rdGlvbmVuIGF1ZnJ1ZmVuIHVuZCBhdWNoIGF1ZiBrZWluZVxuICAgIC8vIFByb3BlcnRpZXMgenVncmVpZmVuLCBkLmguIGVzIG11c3Mgdm9yaGVyIGVpbiBUeXBlY2FzdCBkdXJjaGdlZnVlaHJ0IHdlcmRlblxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBtYXgtcGFyYW1zXG4gICAgdmFsaWRhdGVVVUlEKF86IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbiwgaWQ6IHVua25vd24pIHtcbiAgICAgICAgaWYgKHR5cGVvZiBpZCAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHJlcy5zdGF0dXMoSHR0cFN0YXR1cy5CQURfUkVRVUVTVCkuc2VuZCgnS2VpbmUgZ3VlbHRpZ2UgQnVjaC1JRCcpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGlkU3RyID0gaWQgYXMgc3RyaW5nO1xuICAgICAgICBpZiAodmFsaWRhdG9yLmlzVVVJRChpZFN0cikpIHtcbiAgICAgICAgICAgIGxvZ2dlci5kZWJ1ZygnU2hhcmVkUmVxdWVzdEhhbmRsZXIudmFsaWRhdGVVVUlEKCk6IGlzVVVJRCcpO1xuICAgICAgICAgICAgbmV4dCgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbG9nZ2VyLmRlYnVnKCdTaGFyZWRSZXF1ZXN0SGFuZGxlci52YWxpZGF0ZVVVSUQoKTogc3RhdHVzPUJBRF9SRVFVRVNUJyk7XG4gICAgICAgIHJlcy5zdGF0dXMoSHR0cFN0YXR1cy5CQURfUkVRVUVTVCkuc2VuZChcbiAgICAgICAgICAgIGAke2lkU3RyfSBpc3Qga2VpbmUgZ3VlbHRpZ2UgQnVjaC1JRGAsXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgdmFsaWRhdGVDb250ZW50VHlwZShyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikge1xuICAgICAgICBjb25zdCBjb250ZW50VHlwZSA9IHJlcS5oZWFkZXIoJ0NvbnRlbnQtVHlwZScpO1xuICAgICAgICBpZiAoY29udGVudFR5cGUgPT09IHVuZGVmaW5lZCB8fCB2YWxpZGF0b3IuaXNNaW1lVHlwZShjb250ZW50VHlwZSkpIHtcbiAgICAgICAgICAgIGxvZ2dlci5kZWJ1ZygnU2hhcmVkUmVxdWVzdEhhbmRsZXIudmFsaWRhdGVDb250ZW50VHlwZSgpOiBvaycpO1xuICAgICAgICAgICAgbmV4dCgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbG9nZ2VyLmRlYnVnKFxuICAgICAgICAgICAgJ1NoYXJlZFJlcXVlc3RIYW5kbGVyLnZhbGlkYXRlQ29udGVudFR5cGUoKTogc3RhdHVzPUJBRF9SRVFVRVNUJyxcbiAgICAgICAgKTtcbiAgICAgICAgcmVzLnN0YXR1cyhIdHRwU3RhdHVzLkJBRF9SRVFVRVNUKS5zZW5kKFxuICAgICAgICAgICAgYCR7Y29udGVudFR5cGV9IGlzdCBrZWluIGd1ZWx0aWdlciBNSU1FLVR5cGAsXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgbm90Rm91bmQoXzogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkge1xuICAgICAgICByZXMuc2VuZFN0YXR1cyhIdHRwU3RhdHVzLk5PVF9GT1VORCk7XG4gICAgfVxuXG4gICAgaW50ZXJuYWxFcnJvcihlcnI6IHVua25vd24sIF86IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpIHtcbiAgICAgICAgbG9nZ2VyLmVycm9yKFxuICAgICAgICAgICAgYFNoYXJlZFJlcXVlc3RIYW5kbGVyLmludGVybmFsRXJyb3IoKTogZXJyb3I9JHtKU09ONS5zdHJpbmdpZnkoXG4gICAgICAgICAgICAgICAgZXJyLFxuICAgICAgICAgICAgKX1gLFxuICAgICAgICApO1xuICAgICAgICByZXMuc2VuZFN0YXR1cyhIdHRwU3RhdHVzLklOVEVSTkFMX0VSUk9SKTtcbiAgICB9XG5cbiAgICBub3RZZXRJbXBsZW1lbnRlZChfOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSB7XG4gICAgICAgIGxvZ2dlci5lcnJvcignU2hhcmVkUmVxdWVzdEhhbmRsZXIubm90WWV0SW1wbGVtZW50ZWQoKScpO1xuICAgICAgICByZXMuc2VuZFN0YXR1cyhIdHRwU3RhdHVzLk5PVF9ZRVRfSU1QTEVNRU5URUQpO1xuICAgIH1cbn1cbmNvbnN0IGhhbmRsZXIgPSBuZXcgU2hhcmVkUmVxdWVzdEhhbmRsZXIoKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEUgeCBwIG8gciB0IGkgZSByIHQgZSAgIEYgdSBuIGMgdCBpIG8gbiBzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZXhwb3J0IGNvbnN0IGxvZ1JlcXVlc3RIZWFkZXIgPSAoXG4gICAgcmVxOiBSZXF1ZXN0LFxuICAgIHJlczogUmVzcG9uc2UsXG4gICAgbmV4dDogTmV4dEZ1bmN0aW9uLFxuKSA9PiBoYW5kbGVyLmxvZ1JlcXVlc3RIZWFkZXIocmVxLCByZXMsIG5leHQpO1xuXG5leHBvcnQgY29uc3QgdmFsaWRhdGVDb250ZW50VHlwZSA9IChcbiAgICByZXE6IFJlcXVlc3QsXG4gICAgcmVzOiBSZXNwb25zZSxcbiAgICBuZXh0OiBOZXh0RnVuY3Rpb24sXG4pID0+IGhhbmRsZXIudmFsaWRhdGVDb250ZW50VHlwZShyZXEsIHJlcywgbmV4dCk7XG5cbi8vIERlciBUeXAgXCJ1bmtub3duXCIgcmVwcmFlc2VudGllcnQgaXJnZW5kZWluZW4gV2VydCBnZW5hdXNvIHdpZSBcImFueVwiLFxuLy8gYWJlciBhdWYgZGVtIFdlcnQga2FubiBtYW4ga2VpbmUgRnVua3Rpb25lbiBhdWZydWZlbiB1bmQgYXVjaCBhdWYga2VpbmVcbi8vIFByb3BlcnRpZXMgenVncmVpZmVuLCBkLmguIGVzIG11c3Mgdm9yaGVyIGVpbiBUeXBlY2FzdCBkdXJjaGdlZnVlaHJ0IHdlcmRlblxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlVVVJRCA9IChcbiAgICByZXE6IFJlcXVlc3QsXG4gICAgcmVzOiBSZXNwb25zZSxcbiAgICBuZXh0OiBOZXh0RnVuY3Rpb24sXG4gICAgaWQ6IHVua25vd24sXG4pID0+IGhhbmRsZXIudmFsaWRhdGVVVUlEKHJlcSwgcmVzLCBuZXh0LCBpZCk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbWF4LXBhcmFtc1xuXG5leHBvcnQgY29uc3Qgbm90Rm91bmQgPSAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSA9PlxuICAgIGhhbmRsZXIubm90Rm91bmQocmVxLCByZXMpO1xuXG5leHBvcnQgY29uc3QgaW50ZXJuYWxFcnJvciA9IChlcnI6IHVua25vd24sIHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkgPT5cbiAgICBoYW5kbGVyLmludGVybmFsRXJyb3IoZXJyLCByZXEsIHJlcyk7XG5cbmV4cG9ydCBjb25zdCBub3RZZXRJbXBsZW1lbnRlZCA9IChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpID0+XG4gICAgaGFuZGxlci5ub3RZZXRJbXBsZW1lbnRlZChyZXEsIHJlcyk7XG5cbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9leHByZXNzanMvZXhwcmVzcy9pc3N1ZXMvMjI1OVxuLy8gaHR0cHM6Ly9naXRodWIuY29tL2V4cHJlc3Nqcy9leHByZXNzL3B1bGwvMjQzMVxuLy8gaHR0cHM6Ly9zdHJvbmdsb29wLmNvbS9zdHJvbmdibG9nL2FzeW5jLWVycm9yLWhhbmRsaW5nLWV4cHJlc3Nqcy1lczctcHJvbWlzZXMtZ2VuZXJhdG9yc1xuZXhwb3J0IGNvbnN0IHdyYXAgPSAoZm46IGFueSkgPT4gKC4uLmFyZ3M6IGFueVtdKSA9PiBmbiguLi5hcmdzKS5jYXRjaChhcmdzWzJdKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW5zYWZlLXJldHVyblxuIl19