import { Text3D, useFont } from "@react-three/drei";
import { BufferGeometryUtils, Font, FontLoader, LottieLoader } from "three/examples/jsm/Addons.js";
import * as THREE from "three";
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

interface SkylineBaseProps {
    username: string;
    year: string;
    length: number;
    width: number;
    height: number;
    padding: number;
}

let font: Font | null = null;

const loadFont = async () => {
    if (font !== null) {
        return font;
    }
    const loader = new FontLoader();
    font = await loader.loadAsync("/Inter_Bold.json");
    return font;
}

export function SkylineBase(props: SkylineBaseProps) {
    const font = useFont("/Inter_Bold.json");
    // const username = new TextGeometry(props.username, {

    // })

    const base = new THREE.BoxGeometry(
        props.length + props.padding,
        props.height,
        props.width + props.padding
    );

    const geometries = [
        base
    ]

    const merged = BufferGeometryUtils.mergeGeometries(geometries)
}