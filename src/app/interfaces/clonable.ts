export abstract class Clonable {

    proto: {key: string, value: any|Clonable}[];

    constructor(proto: {key: string, value: any|Clonable}[]|Clonable = []) {
        this.proto = this.cloneProto(proto instanceof Clonable ? proto.proto : proto);
        this.sync();
    }

    sync() {
        this.proto.forEach(prot => this[prot.key] = prot.value);
    }

    cloneProto(proto?: {key: string, value: any|Clonable}[]) {
        const source = proto ? proto : this.proto;
        return source.map(prot => ({
            key: prot.key,
            value: prot.value instanceof Clonable
                ? prot.value.cloneProto()
                : prot.value}));
    }

    appendProt(prot: {key: string, value: any|Clonable}) {
        const newProt = prot;
        newProt.value = prot.value instanceof Clonable
            ? prot.value.cloneProto()
            : prot.value;
        this.proto.push(newProt);
        this.sync();
    }

    updateProt(prot: {key: string, value: any|Clonable}) {
        this.proto[prot.key] = prot.value instanceof Clonable
            ? prot.value.cloneProto()
            : prot.value;
        this.sync();
    }

}
