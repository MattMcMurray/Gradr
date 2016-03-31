package com.se2.gradr.gradr.fragments;

import android.content.Context;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import com.se2.gradr.gradr.R;
import com.se2.gradr.gradr.User;
import com.se2.gradr.gradr.UserAndImage;

/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link ViewMatchFragment.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link ViewMatchFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class ViewMatchFragment extends Fragment {

    private int userId;
    private String username;
    private UserAndImage match;

    private OnFragmentInteractionListener mListener;

    //We call findViewById on this guy
    private View rootView;

    public ViewMatchFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param userId ID of the current signed in user
     * @param username username of the current signed in user
     * @param match a User object containing info about the match we're investigating
     * @return A new instance of fragment ViewMatchFragment.
     */
    public static ViewMatchFragment newInstance(int userId, String username, User match) {
        ViewMatchFragment fragment = new ViewMatchFragment();
        Bundle args = new Bundle();
        args.putInt("id", userId);
        args.putString("username", username);
        args.putSerializable("match", match);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            userId = getArguments().getInt("id");
            username = getArguments().getString("username");
            User currMatch = (User) getArguments().getSerializable("match");
            match = new UserAndImage(currMatch);
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        rootView = inflater.inflate(R.layout.fragment_view_student, container, false);
        populateFields();
        return rootView;
    }

    @Override
    public void onAttach(Context context) {
        super.onAttach(context);
        if (context instanceof OnFragmentInteractionListener) {
            mListener = (OnFragmentInteractionListener) context;
        } else {
            throw new RuntimeException(context.toString()
                    + " must implement OnFragmentInteractionListener");
        }
    }

    @Override
    public void onDetach() {
        super.onDetach();
        mListener = null;
    }


    public void populateFields() {
        ImageView imageView = (ImageView) rootView.findViewById(R.id.match_image);
        imageView.setScaleType(ImageView.ScaleType.FIT_XY);
        match.setImage(imageView);

        TextView tv = (TextView) rootView.findViewById(R.id.match_name);
        tv.setText(match.getFirstName() + " " + match.getLastName());

        tv = (TextView) rootView.findViewById(R.id.match_courses);
        tv.setText(match.getCourses());

        tv = (TextView) rootView.findViewById(R.id.match_school);
        tv.setText(match.getSchool());

        tv = (TextView) rootView.findViewById(R.id.match_city);
        tv.setText(match.getCity());

        tv = (TextView) rootView.findViewById(R.id.match_country);
        tv.setText(match.getCountry());

        tv = (TextView) rootView.findViewById(R.id.match_generalDescription);
        tv.setText(match.getGeneralDescription());

        tv = (TextView) rootView.findViewById(R.id.match_helpDescription);
        tv.setText(match.getHelpDescription());
    }

    /**
     * This interface must be implemented by activities that contain this
     * fragment to allow an interaction in this fragment to be communicated
     * to the activity and potentially other fragments contained in that
     * activity.
     * <p/>
     * See the Android Training lesson <a href=
     * "http://developer.android.com/training/basics/fragments/communicating.html"
     * >Communicating with Other Fragments</a> for more information.
     */
    public interface OnFragmentInteractionListener {
        void onFragmentInteraction(Uri uri);
    }
}
