import React, { useState } from "react";
import Select from 'react-select';
import { connect } from 'react-redux';
import { IRootState } from "app/shared/reducers";
import { Translate } from "react-jhipster";
import { Flex, Radio, RadioGroup, TextField, View } from "@adobe/react-spectrum";
import { getDimensionsList, getThresholdMeasuresList } from "app/entities/feature/feature.reducer";
import { AGGREGATION_TYPES, COMPARABLE_DATA_TYPES, COMPARISIONS, TIME_UNIT } from "app/shared/util/data-constraints.constants";
import { setConditions, setTimeConditions } from "../canvas/scheduler/scheduler.reducer";


const ThresholdAlert = (props) => {
    return (
        <>
            <RadioGroup orientation="horizontal" label="Threshold Type" onChange={(event) => {
                props.condition.thresholdMode = event
                props.setConditions({ ...props.condition })
            }} value={props.condition?.thresholdMode} isEmphasized>
                <Radio value="Absolute">Absolute</Radio>
                <Radio value="Dynamic">Dynamic</Radio>
            </RadioGroup>

            <div className='threshold'>
                {props.condition.thresholdMode === 'Dynamic' && (

                    <Flex direction="row" gap="size-150" alignItems="start" >
                        <View width={'20%'} >
                            <span>
                                <Translate contentKey="scheduler.threshold.thresholdField">Threshold field*</Translate>
                            </span>
                            <Select
                                className='threshold'
                                styles={{ width: 1000 }}
                                isSearchable={true}
                                name="color"
                                value={props.condition?.featureName}
                                onChange={(event) => {
                                    props.condition.featureName = event
                                    props.setConditions({ ...props.condition })
                                }}
                                options={getThresholdMeasuresList(props.visual.fields.filter((item) => { return item.feature.featureType === "MEASURE" }))} />
                        </View>

                        <View width={'20%'} >
                            <span>
                                <Translate contentKey="scheduler.threshold.aggregationTypes">Agg.type*</Translate>
                            </span>
                            <Select
                                isSearchable={true}
                                name="color"
                                value={props.condition?.compare?.value}
                                onChange={(event) => {
                                    props.condition.compare.value = event
                                    props.setConditions({ ...props.condition })
                                }}
                                options={AGGREGATION_TYPES} />
                        </View>

                        <View width={'20%'} >
                            <span>
                                <Translate contentKey="scheduler.threshold.dimension">Dimension*</Translate>
                            </span>
                            <Select
                                isSearchable={true}
                                name="color"
                                onChange={(event) => {
                                    if (props.timeConditions?.feature?.definition) {
                                        props.timeConditions.feature.definition = event
                                    }
                                    props.setTimeConditions({ ...props.timeConditions })
                                }}
                                value={props.timeConditions?.feature?.definition}
                                options={getDimensionsList(props.features.filter((feature) => { return COMPARABLE_DATA_TYPES.includes(feature.type) !== false }))} />
                        </View>
                        <View width={'20%'} >
                            <span>
                                <Translate contentKey="scheduler.threshold.unit">Unit*</Translate>
                            </span>
                            <Select
                                isSearchable={true}
                                name="TIME_UNIT"
                                onChange={(event) => {
                                    props.timeConditions.unit = event
                                    props.setTimeConditions({ ...props.timeConditions })
                                }}
                                value={props.timeConditions?.unit}
                                options={TIME_UNIT} />
                        </View>
                        <View width={'20%'} >

                            <TextField label="Value"
                                onChange={(event) => {
                                    props.timeConditions.value = Number(event)
                                    props.setTimeConditions({ ...props.timeConditions })
                                }}
                            />
                        </View>
                    </Flex>
                )}
                <Flex direction='row' gap="size-150" >
                    <View width={'33%'} >
                        <span>
                            <Translate contentKey="scheduler.threshold.measure">Measure*</Translate>
                        </span>
                        <Select
                            styles={{ width: 1000 }}
                            isSearchable={true}
                            name="color"
                            value={props.condition?.featureName}
                            onChange={(event) => {
                                props.condition.featureName = event
                                props.setConditions({ ...props.condition })
                            }}
                            options={getThresholdMeasuresList(props.visual.fields.filter((item) => { return item.feature.featureType === "MEASURE" }))} />
                    </View>
                    <View width={'33%'} >
                        <span>
                            <Translate contentKey="scheduler.threshold.compare">Compare*</Translate>
                        </span>
                        <Select
                            isSearchable={true}
                            name="color"
                            label="Compare*"
                            value={props.condition?.compare?.value}
                            onChange={(event) => {
                                props.condition.compare.value = event
                                props.setConditions({ ...props.condition })
                            }}
                            options={COMPARISIONS} />
                    </View>
                    <View width={'33%'} >
                        <TextField label={'Threshold'} value={props.condition?.value?.toString() || ''}
                            onChange={(event) => {
                                props.condition.value = event
                                props.setConditions({ ...props.condition })
                            }}
                        />
                    </View>
                </Flex>
                <Flex direction='row' gap="size-150" >
                    <View width={'33%'} >
                        <span>
                            <Translate contentKey="scheduler.threshold.dimension">Dimension*</Translate>
                        </span>
                        <Select
                            isSearchable={true}
                            name="color"
                            onChange={(event) => {
                                if (props.timeConditions?.feature?.definition) {
                                    props.timeConditions.feature.definition = event
                                }
                                props.setTimeConditions({ ...props.timeConditions })
                            }}
                            value={props.timeConditions?.feature?.definition}
                            options={getDimensionsList(props.features.filter((feature) => { return COMPARABLE_DATA_TYPES.includes(feature.type) !== false }))} />
                    </View>
                    <View width={'33%'} >
                        <span>
                            <Translate contentKey="scheduler.threshold.unit">Unit*</Translate>
                        </span>
                        <Select
                            isSearchable={true}
                            name="TIME_UNIT"
                            onChange={(event) => {
                                props.timeConditions.unit = event
                                props.setTimeConditions({ ...props.timeConditions })
                            }}
                            value={props.timeConditions?.unit}
                            options={TIME_UNIT} />
                    </View>
                    <View width={'33%'} >
                        <TextField label={'Value'}
                            onChange={(event) => {
                                props.timeConditions.value = Number(event)
                                props.setTimeConditions({ ...props.timeConditions })
                            }}
                        />
                    </View>
                </Flex>
            </div>
        </>
    )
}

const mapStateToProps = (storeState: IRootState) => ({
    features: storeState.feature.entities,
    condition: storeState.scheduler.condition,
    timeConditions: storeState.scheduler.timeConditions,
    visual: storeState.visualmetadata.entity
});

const mapDispatchToProps = {
    setConditions,
    setTimeConditions
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ThresholdAlert);

