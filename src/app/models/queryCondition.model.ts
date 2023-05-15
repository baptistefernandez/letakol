import { QueryConstraint, where } from "firebase/firestore";
import { ECompare } from "./enums/firebase-compare.enum"

export class QueryCondition {
    constructor(
        private _field: string,
        private _comparator: ECompare,
        private _value: string | number
    ) { }

    public toWhere(): QueryConstraint {
        return where(this._field, this._comparator, this._value);
    }
}

export class EqualCondition extends QueryCondition {
    constructor(_field: string, _value: string | number) {
        super(_field, ECompare.Equal, _value)
    }
}